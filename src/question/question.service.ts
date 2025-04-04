import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Question } from './entity/question.entity';
import { Option } from './entity/option.entity';
import { CreateQuestionDto } from './dtos/create_question.dto';
import { SubmitAnswerDto } from './dtos/submit_answer.dto';
import { Answer } from './entity/submit_answer_entity';
import { Assessment } from './../assessment/entity/assessment.entity';
import { User } from 'src/users/entity/users.entity';
import { UserScore } from 'src/users/entity/user_score.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,

    @InjectRepository(Option)
    private readonly optionsRepository: Repository<Option>,

    @InjectRepository(Answer)
    private readonly answersRepository: Repository<Answer>,
    @InjectRepository(Assessment)
    private readonly assessmentsRepository: Repository<Assessment>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserScore)
    private readonly userScoreRepository: Repository<UserScore>,
  ) {}

  // Create a new question with options
  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const {
      question_text,
      options,
      assessment_id,
      points = 1,
    } = createQuestionDto;

    try {
      console.log('Creating question:', question_text);

      // Find the assessment by ID
      const assessment = await this.assessmentsRepository.findOne({
        where: { id: assessment_id },
      });

      if (!assessment) {
        throw new Error('Assessment not found');
      }

      // Create the Question entity and link it to the assessment
      const question = this.questionsRepository.create({
        question_text,
        assessment, // Set the assessment
        points,
      });

      console.log('Saving question...');
      // Save the Question entity to the database
      await this.questionsRepository.save(question);

      // Create Option entities for the question
      const optionsEntities = options.map((opt) => {
        console.log(`Creating option: ${opt.option_text}`);
        const option = this.optionsRepository.create({
          option_text: opt.option_text,
          is_correct: opt.is_correct,
          question: question,
        });
        return option;
      });

      console.log('Saving options...');
      // Save options to the database
      await this.optionsRepository.save(optionsEntities);

      // Update the Question with the correct_option_id
      const correctOption = optionsEntities.find((opt) => opt.is_correct);
      if (correctOption) {
        question.correct_option_id = correctOption.id;
      }

      console.log('Saving question with correct_option_id...');
      await this.questionsRepository.save(question);

      console.log('Question created successfully');
      return question;
    } catch (error) {
      console.error('Error in creating question and options:', error);
      throw error; // Re-throw the error to propagate it
    }
  }
  // async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
  //   const {
  //     question_text,
  //     options,
  //     assessment_id,
  //     points = 1,
  //     is_multiple_choice = false,
  //   } = createQuestionDto;

  //   try {
  //     console.log('Creating question:', question_text);

  //     // Find the assessment by ID
  //     const assessment = await this.assessmentsRepository.findOne({
  //       where: { id: assessment_id },
  //     });

  //     if (!assessment) {
  //       throw new Error('Assessment not found');
  //     }

  //     // Create the Question entity and link it to the assessment
  //     const question = this.questionsRepository.create({
  //       question_text,
  //       assessment, // Set the assessment
  //       points,
  //       is_multiple_choice,
  //     });

  //     console.log('Saving question...');
  //     // Save the Question entity to the database
  //     await this.questionsRepository.save(question);

  //     // Create Option entities for the question
  //     const optionsEntities = options.map((opt) => {
  //       console.log(`Creating option: ${opt.option_text}`);
  //       const option = this.optionsRepository.create({
  //         option_text: opt.option_text,
  //         is_correct: opt.is_correct,
  //         question: question,
  //       });
  //       return option;
  //     });

  //     console.log('Saving options...');
  //     // Save options to the database
  //     await this.optionsRepository.save(optionsEntities);

  //     // ✅ If single choice, store correct option ID.

  //     // For multiple-choice, set `correct_option_id` as an array of correct option IDs
  //     if (is_multiple_choice) {
  //       const correctOptions = optionsEntities.filter((opt) => opt.is_correct);
  //       question.correct_option_ids = correctOptions.map((opt) => opt.id); // Store all correct options
  //     } else {
  //       // For single-choice, set the correct option ID
  //       const correctOption = optionsEntities.find((opt) => opt.is_correct);
  //       if (correctOption) {
  //         question.correct_option_id = correctOption.id;
  //       }
  //     }

  //     // Update the Question with the correct_option_id
  //     // const correctOption = optionsEntities.find((opt) => opt.is_correct);
  //     // if (correctOption) {
  //     //   question.correct_option_id = correctOption.id;
  //     // }

  //     console.log('Saving question with correct_option_id...');
  //     await this.questionsRepository.save(question);

  //     console.log('Question created successfully');
  //     return question;
  //   } catch (error) {
  //     console.error('Error in creating question and options:', error);
  //     throw error; // Re-throw the error to propagate it
  //   }
  // }

  // Submit an answer for a question
  async submitAnswer(
    question_id: number,
    option_id: number,
    user_id: number,
  ): Promise<{
    correct: boolean;
    points: number;
    correctPercentage: number;
    wrongPercentage: number;
  }> {
    try {
      // Fetch the question with relations
      const question = await this.questionsRepository.findOne({
        where: { id: question_id },
        relations: ['options', 'assessment'],
      });

      if (!question) {
        throw new NotFoundException('Question not found');
      }

      // Ensure question has an assessment before accessing its ID
      if (!question.assessment) {
        throw new NotFoundException('Assessment not found for this question');
      }

      // Fetch the selected option
      const selectedOption = await this.optionsRepository.findOne({
        where: { id: option_id, question: { id: question_id } },
      });

      if (!selectedOption) {
        throw new NotFoundException('Option not found for this question');
      }

      // Fetch the user
      const user = await this.usersRepository.findOne({
        where: { id: user_id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Determine correctness and points awarded
      const isCorrect = selectedOption.is_correct;
      const pointsAwarded = isCorrect ? question.points : 0;

      // Save the answer
      const answer = this.answersRepository.create({
        question,
        option: selectedOption,
        user, // No need to use `{ id: user_id }`
        is_correct: isCorrect,
      });

      await this.answersRepository.save(answer);

      // Handle user score (check if it exists, update or create)
      let userScore = await this.userScoreRepository.findOne({
        where: {
          user: { id: user_id },
          assessment: { id: question.assessment.id }, // Ensure assessment exists
        },
      });

      if (userScore) {
        // Update the score with the points awarded
        userScore.score += pointsAwarded;

        // Track correct/wrong answers
        if (isCorrect) {
          userScore.correct_answers += 1;
        } else {
          userScore.wrong_answers += 1;
        }

        // Always increment total quizzes attempted
        userScore.total_quizzes += 1;
      } else {
        // Create a new user score record if it doesn't exist
        userScore = this.userScoreRepository.create({
          user,
          assessment: question.assessment,
          score: pointsAwarded,
          correct_answers: isCorrect ? 1 : 0,
          wrong_answers: isCorrect ? 0 : 1,
          total_quizzes: 1,
        });
      }

      // Calculate percentage
      const correctPercentage =
        (userScore.correct_answers / userScore.total_quizzes) * 100;
      const wrongPercentage =
        (userScore.wrong_answers / userScore.total_quizzes) * 100;

      // Store the percentage in the UserScore entity
      userScore.percentage = correctPercentage;

      // Save the updated/new user score with percentage
      await this.userScoreRepository.save(userScore);

      // Return result with percentages
      return {
        correct: isCorrect,
        points: pointsAwarded,
        correctPercentage,
        wrongPercentage,
      };
    } catch (error) {
      console.error('Error saving answer:', error);
      throw new Error('Error occurred while saving the answer');
    }
  }

  // async submitAnswer(
  //   question_id: number,
  //   option_ids: number[], // Accept multiple option IDs
  //   user_id: number,
  // ): Promise<{
  //   correct: boolean;
  //   points: number;
  //   correctPercentage: number;
  //   wrongPercentage: number;
  // }> {
  //   try {
  //     // Fetch the question with relations
  //     const question = await this.questionsRepository.findOne({
  //       where: { id: question_id },
  //       relations: ['options', 'assessment'],
  //     });

  //     if (!question) {
  //       throw new NotFoundException('Question not found');
  //     }

  //     if (!question.assessment) {
  //       throw new NotFoundException('Assessment not found for this question');
  //     }

  //     // Fetch all selected options
  //     const selectedOptions = await this.optionsRepository.find({
  //       where: { id: In(option_ids), question: { id: question_id } },
  //     });

  //     if (selectedOptions.length === 0) {
  //       throw new NotFoundException('No valid options found for this question');
  //     }

  //     // Fetch all correct options for this question
  //     const correctOptions = question.options.filter((opt) => opt.is_correct);

  //     // Check for correctness for multiple-choice
  //     let pointsAwarded = 0;
  //     let isCorrect = false;

  //     if (question.is_multiple_choice) {
  //       const correctSelected = selectedOptions.filter(
  //         (opt) => opt.is_correct,
  //       ).length;
  //       const totalCorrect = correctOptions.length;

  //       // Check if all selected options are correct, and no incorrect options were selected
  //       const isAllCorrect = correctSelected === selectedOptions.length; // Ensure all selected options are correct
  //       const isFullyCorrect = correctSelected === totalCorrect; // Ensure total correct options match

  //       if (isAllCorrect && isFullyCorrect) {
  //         pointsAwarded = question.points; // Full points if all answers are correct
  //         isCorrect = true;
  //       } else {
  //         // Award partial points for correct selections
  //         pointsAwarded = (correctSelected / totalCorrect) * question.points;
  //         isCorrect = false; // It's not fully correct if there's any wrong answer
  //       }
  //     } else {
  //       // For single-choice questions
  //       isCorrect = selectedOptions.every((opt) => opt.is_correct); // Single choice, all must be correct
  //       pointsAwarded = isCorrect ? question.points : 0;
  //     }

  //     // Fetch the user
  //     const user = await this.usersRepository.findOne({
  //       where: { id: user_id },
  //     });

  //     if (!user) {
  //       throw new NotFoundException('User not found');
  //     }

  //     // Save each selected answer separately
  //     for (const option of selectedOptions) {
  //       const answer = this.answersRepository.create({
  //         question,
  //         option,
  //         user,
  //         is_correct: option.is_correct,
  //       });
  //       await this.answersRepository.save(answer);
  //     }

  //     // Handle user score tracking
  //     let userScore = await this.userScoreRepository.findOne({
  //       where: {
  //         user: { id: user_id },
  //         assessment: { id: question.assessment.id },
  //       },
  //     });

  //     if (userScore) {
  //       // Update existing score
  //       userScore.score += pointsAwarded;
  //       userScore.correct_answers += isCorrect ? 1 : 0;
  //       userScore.wrong_answers += isCorrect ? 0 : 1;
  //       userScore.total_quizzes += 1;
  //     } else {
  //       // Create new score record if it doesn't exist
  //       userScore = this.userScoreRepository.create({
  //         user,
  //         assessment: question.assessment,
  //         score: pointsAwarded,
  //         correct_answers: isCorrect ? 1 : 0,
  //         wrong_answers: isCorrect ? 0 : 1,
  //         total_quizzes: 1,
  //       });
  //     }

  //     // Calculate percentages
  //     const correctPercentage =
  //       (userScore.correct_answers / userScore.total_quizzes) * 100;
  //     const wrongPercentage =
  //       (userScore.wrong_answers / userScore.total_quizzes) * 100;
  //     userScore.percentage = correctPercentage;

  //     // Save updated score
  //     await this.userScoreRepository.save(userScore);

  //     return {
  //       correct: isCorrect,
  //       points: pointsAwarded,
  //       correctPercentage,
  //       wrongPercentage,
  //     };
  //   } catch (error) {
  //     console.error('Error saving answer:', error);
  //     throw new Error('Error occurred while saving the answer');
  //   }
  // }

  // Find all questions with their options
  async findAll(): Promise<Question[]> {
    return this.questionsRepository.find({ relations: ['options'] });
  }

  // Validate the user's answer
  async validateAnswer(submitAnswerDto: SubmitAnswerDto): Promise<boolean> {
    const { question_id, option_id } = submitAnswerDto;

    // Find the question with options
    const question = await this.questionsRepository.findOne({
      where: { id: question_id },
      relations: ['options'],
    });

    if (!question) {
      throw new Error('Question not found');
    }

    // Find the selected option
    const selectedOption = question.options.find(
      (option) => option.id === option_id,
    );
    if (!selectedOption) {
      throw new Error('Option not found');
    }

    // Return whether the selected option is correct
    return selectedOption.id === question.correct_option_id;
  }
}
