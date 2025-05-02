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

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const {
      question_text,
      options,
      assessment_id,
      points = 1,
      is_multiple_choice = false,
      is_yes_no = false,
    } = createQuestionDto;

    try {
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
        assessment,
        points,
        is_multiple_choice,
        is_yes_no,
      });

      // Save the Question entity to the database
      await this.questionsRepository.save(question);

      // Create Option entities for the question
      const optionsEntities = options.map((opt) => {
        const option = this.optionsRepository.create({
          option_text: opt.option_text,
          is_correct: opt.is_correct,
          question: question,
        });
        return option;
      });

      // Save options to the database
      await this.optionsRepository.save(optionsEntities);

      // For Yes/No questions, adjust the logic to set the correct_option_id to "Yes" or "No"
      if (is_yes_no) {
        const correctOption = optionsEntities.find((opt) => opt.is_correct);

        // Ensure there are exactly 2 options: Yes and No
        if (optionsEntities.length !== 2) {
          throw new Error('Yes/No questions must have exactly two options');
        }

        // Set correct_option_id based on the correct option text ("Yes" or "No")
        if (correctOption) {
          question.correct_option_id = correctOption.option_text; // Use the option text (either "Yes" or "No")
        }
      } else if (is_multiple_choice) {
        // For multiple-choice, set `correct_option_ids` as an array of correct option IDs
        const correctOptions = optionsEntities.filter((opt) => opt.is_correct);
        question.correct_option_ids = correctOptions.map((opt) => opt.id); // Store all correct options
      } else {
        // For single-choice, set the correct option ID
        const correctOption = optionsEntities.find((opt) => opt.is_correct);
        if (correctOption) {
          question.correct_option_id = correctOption.id;
        }
      }

      // Save the final question with correct_option_id(s)
      await this.questionsRepository.save(question);

      console.log('Question created successfully');
      return question;
    } catch (error) {
      console.error('Error in creating question and options:', error);
      throw error;
    }
  }

  // Submit an answer for a question
  async submitAnswer(
    question_id: number,
    option_ids: number[], // Accept multiple option IDs
    user_id: number,
  ): Promise<{
    correct: boolean;
    points: number;
    correctPercentage: number;
    wrongPercentage: number;
  }> {
    try {
      console.log(
        'Submitting answer for question:',
        question_id,
        'with options:',
        option_ids,
        'and user:',
        user_id,
      );

      // Fetch the question with relations
      const question = await this.questionsRepository.findOne({
        where: { id: question_id },
        relations: ['options', 'assessment'],
      });

      if (!question) throw new NotFoundException('Question not found');
      if (!question.assessment)
        throw new NotFoundException('Assessment not found for this question');

      // Fetch selected options
      const selectedOptions = await this.optionsRepository.find({
        where: { id: In(option_ids), question: { id: question_id } },
      });

      if (selectedOptions.length === 0)
        throw new NotFoundException('No valid options found for this question');

      const correctOptions = question.options.filter((opt) => opt.is_correct);
      const correctSelected = selectedOptions.filter(
        (opt) => opt.is_correct,
      ).length;
      const totalCorrect = correctOptions.length;

      const pointsAwarded =
        totalCorrect > 0
          ? (correctSelected / totalCorrect) * question.points
          : 0;

      const user = await this.usersRepository.findOne({
        where: { id: user_id },
      });
      if (!user) throw new NotFoundException('User not found');

      for (const option of selectedOptions) {
        const answer = this.answersRepository.create({
          question,
          option,
          user,
          is_correct: option.is_correct,
        });
        await this.answersRepository.save(answer);
      }

      let userScore = await this.userScoreRepository.findOne({
        where: {
          user: { id: user_id },
          assessment: { id: question.assessment.id },
        },
      });

      if (userScore) {
        userScore.score += pointsAwarded;
        userScore.correct_answers += correctSelected;
        userScore.wrong_answers += selectedOptions.length - correctSelected;
      } else {
        userScore = this.userScoreRepository.create({
          user,
          assessment: question.assessment,
          score: pointsAwarded,
          correct_answers: correctSelected,
          wrong_answers: selectedOptions.length - correctSelected,
          total_quizzes: 0, // Start total quizzes from 0 and count only after each quiz is answered
        });
      }

      // ✅ FIXED: Handle the correct percentage and wrong percentage separately for multiple-choice vs single-choice questions.
      let correctPercentage: number;
      let wrongPercentage: number;

      // If it's a single-choice question, we increment the total quizzes count
      if (!question.is_multiple_choice) {
        userScore.total_quizzes += 1; // Increment only for single-choice quizzes
      }

      const totalAnswers = userScore.correct_answers + userScore.wrong_answers;

      correctPercentage =
        totalAnswers > 0 ? (userScore.correct_answers / totalAnswers) * 100 : 0;
      wrongPercentage =
        totalAnswers > 0 ? (userScore.wrong_answers / totalAnswers) * 100 : 0;

      userScore.percentage = correctPercentage;
      await this.userScoreRepository.save(userScore);

      return {
        correct: correctSelected === totalCorrect,
        points: pointsAwarded,
        correctPercentage,
        wrongPercentage,
      };
    } catch (error) {
      console.error('Error saving answer:', error);
      throw new Error('Error occurred while saving the answer');
    }
  }

  // New method to find all submitted answers
  async findAllSubmitAnswers(): Promise<any[]> {
    const answers = await this.answersRepository.find({
      relations: ['user', 'question'],
    });
    if (!answers) {
      throw new NotFoundException('No answers found');
    }
    return answers;
  }

  // Find all questions with their options
  async findAll(): Promise<Question[]> {
    return this.questionsRepository.find({
      relations: ['options', 'assessment'],
    });
  }
  async getAllQuestions(): Promise<Question[]> {
    return this.questionsRepository.find({ relations: ['options', 'assessment'] }); // Add relations if you want options too
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

  async getQuestionByAssessmentId(assessment_id: number): Promise<Question[]> {
    const assessment = await this.assessmentsRepository.findOne({
      where: { id: assessment_id },
    });
  
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }
  
    return this.questionsRepository.find({
      where: { assessment: { id: assessment_id } },
      relations: ['options', 'assessment'], // include relations if needed
    });
  }
  
}
