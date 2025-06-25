import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
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
import { Course } from 'src/course/entity/course.entity';
import { UserQuizAttempt } from './entity/UserQuizAttempt.entity'; // Adjust this path as needed
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
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(UserQuizAttempt)
    private readonly userQuizAttemptRepository: Repository<UserQuizAttempt>, // Adjust this path as needed
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const {
      question_text,
      options,
      assessment_id,
      points = 1,
      is_multiple_choice = false,
      is_yes_no = false,
      category = 'easy', // default category
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
        category,
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
      await this.optionsRepository.save(optionsEntities);
      if (is_yes_no) {
        const correctOption = optionsEntities.find((opt) => opt.is_correct);

        if (optionsEntities.length !== 2) {
          throw new Error('Yes/No questions must have exactly two options');
        }
        if (correctOption) {
          question.correct_option_id = correctOption.option_text;
        }
      } else if (is_multiple_choice) {
        const correctOptions = optionsEntities.filter((opt) => opt.is_correct);
        question.correct_option_ids = correctOptions.map((opt) => opt.id);
      } else {
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

  // Update a question and its options
  async updateQuestion(
    id: number,
    updateData: Partial<CreateQuestionDto>,
  ): Promise<Question> {
    const question = await this.questionsRepository.findOne({
      where: { id },
      relations: ['options', 'assessment'],
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    if (updateData.question_text !== undefined) {
      question.question_text = updateData.question_text;
    }

    if (updateData.points !== undefined) {
      question.points = updateData.points;
    }

    if (updateData.is_multiple_choice !== undefined) {
      question.is_multiple_choice = updateData.is_multiple_choice;
    }

    if (updateData.is_yes_no !== undefined) {
      question.is_yes_no = updateData.is_yes_no;
    }

    if (updateData.assessment_id) {
      const assessment = await this.assessmentsRepository.findOne({
        where: { id: updateData.assessment_id },
      });
      if (!assessment) throw new NotFoundException('Assessment not found');
      question.assessment = assessment;
    }

    // Optional: Update options if provided
    if (updateData.options && updateData.options.length > 0) {
      // Remove existing options
      await this.optionsRepository.delete({ question: { id } });

      // Add new options
      const newOptions = updateData.options.map((opt) =>
        this.optionsRepository.create({
          option_text: opt.option_text,
          is_correct: opt.is_correct,
          question,
        }),
      );
      await this.optionsRepository.save(newOptions);

      // Update correct_option_id(s)
      if (question.is_yes_no) {
        const correct = newOptions.find((o) => o.is_correct);
        question.correct_option_id = correct?.option_text ?? '';
      } else if (question.is_multiple_choice) {
        question.correct_option_ids = newOptions
          .filter((o) => o.is_correct)
          .map((o) => o.id);
      } else {
        const correct = newOptions.find((o) => o.is_correct);
        question.correct_option_id = correct?.id ?? null;
      }
    }

    return this.questionsRepository.save(question);
  }

  // Delete a question and its options
  async deleteQuestion(id: number): Promise<{ message: string }> {
    const question = await this.questionsRepository.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    // Delete related options first due to foreign key constraints
    await this.optionsRepository.delete({ question: { id } });

    // Delete the question itself
    await this.questionsRepository.delete(id);

    return { message: 'Question deleted successfully' };
  }

  // Submit an answer for a question
  async submitAnswersBatch(
    answersData: {
      question_id: number;
      option_ids: number[];
      user_id: number;
    }[],
  ): Promise<{
    user_id: number;
    score: number;
    correctAnswers: number;
    wrongAnswers: number;
    percentage: number;
    totalQuizzes: number;
    recommendedCourse?: Course;
  }> {
    if (!answersData.length) throw new Error('No answers provided');

    // Load first question to get assessment
    const firstQuestion = await this.questionsRepository.findOne({
      where: { id: answersData[0].question_id },
      relations: ['assessment', 'options'],
    });
    if (!firstQuestion) throw new NotFoundException('Question not found');
    if (!firstQuestion.assessment)
      throw new NotFoundException('Assessment not found');

    // Load user
    const user = await this.usersRepository.findOne({
      where: { id: answersData[0].user_id },
    });
    if (!user) throw new NotFoundException('User not found');

    // Create a new UserQuizAttempt
    const quizAttempt = this.userQuizAttemptRepository.create({
      user,
      assessment: firstQuestion.assessment,
      score: 0,
      correct_answers: 0,
      wrong_answers: 0,
      percentage: 0,
      total_quizzes: answersData.length,
    });
    await this.userQuizAttemptRepository.save(quizAttempt);

    let totalScore = 0;
    let totalCorrect = 0;
    let totalWrong = 0;

    // Process each question submission
    for (const answerData of answersData) {
      const question = await this.questionsRepository.findOne({
        where: { id: answerData.question_id },
        relations: ['options'],
      });
      if (!question) continue;

      const selectedOptions = await this.optionsRepository.find({
        where: {
          id: In(answerData.option_ids),
          question: { id: question.id },
        },
      });

      const correctOptions = question.options.filter((opt) => opt.is_correct);
      const correctSelected = selectedOptions.filter(
        (opt) => opt.is_correct,
      ).length;
      const totalCorrectOptions = correctOptions.length;

      const pointsAwarded =
        totalCorrectOptions > 0
          ? (correctSelected / totalCorrectOptions) * question.points
          : 0;

      totalScore += pointsAwarded;
      totalCorrect += correctSelected;
      totalWrong += selectedOptions.length - correctSelected;

      // Save each answer linked to the quizAttempt
      for (const option of selectedOptions) {
        const answer = this.answersRepository.create({
          question,
          option,
          user,
          quizAttempt,
          is_correct: option.is_correct,
        });
        await this.answersRepository.save(answer);
      }
    }

    const totalAnswered = totalCorrect + totalWrong;
    const correctPercentage =
      totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;

    // Update quizAttempt with final stats
    quizAttempt.score = totalScore;
    quizAttempt.correct_answers = totalCorrect;
    quizAttempt.wrong_answers = totalWrong;
    quizAttempt.percentage = correctPercentage;
    await this.userQuizAttemptRepository.save(quizAttempt);

    // Recommend a course based on score & assessment
    const recommendedCourse = await this.courseRepository.findOne({
      where: {
        assessment: { id: firstQuestion.assessment.id },
        level:
          correctPercentage >= 85
            ? 'advanced'
            : correctPercentage >= 60
              ? 'intermediate'
              : 'beginner',
        is_active: true,
      },
    });

    return {
      user_id: user.id,
      score: totalScore,
      correctAnswers: totalCorrect,
      wrongAnswers: totalWrong,
      percentage: correctPercentage,
      totalQuizzes: answersData.length,
      recommendedCourse,
    };
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
    return this.questionsRepository.find({
      relations: ['options', 'assessment'],
    }); // Add relations if you want options too
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
