import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      console.log('Received assessment_id:', assessment_id);

      // Find the assessment by ID
      const assessment = await this.assessmentsRepository.findOne({
        where: { id: assessment_id },
      });

      console.log('Fetched Assessment:', assessment);

      if (!assessment) {
        throw new NotFoundException('Assessment not found');
      }

      // Create the Question entity and ensure assessment is linked
      const question = this.questionsRepository.create({
        question_text,
        assessment, // ✅ Explicitly set the assessment
        points,
      });

      console.log('Saving question...');
      await this.questionsRepository.save(question);

      // Create and save the options
      const optionsEntities = options.map((opt) => {
        console.log(`Creating option: ${opt.option_text}`);
        return this.optionsRepository.create({
          option_text: opt.option_text,
          is_correct: opt.is_correct,
          question,
        });
      });

      // Update correct_option_id
      question.correct_option_id = optionsEntities.find(
        (opt) => opt.is_correct,
      )?.id;
      console.log('Saving question with correct_option_id...');
      await this.questionsRepository.save(question);

      console.log('Question created successfully');
      return question;
    } catch (error) {
      console.error('Error in creating question and options:', error);
      throw new Error('Failed to create question');
    }
  }

  // submit answer
  async submitAnswer(
    question_id: number,
    option_id: number,
    user_id: number,
  ): Promise<{ correct: boolean; points: number }> {
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
          assessment: { id: question.assessment.id }, // ✅ Fix: question.assessment is now ensured to exist
        },
      });

      if (userScore) {
        userScore.score += pointsAwarded;
      } else {
        userScore = this.userScoreRepository.create({
          user, 
          assessment: question.assessment,
          score: pointsAwarded,
        });
      }

      // Save the updated/new user score
      await this.userScoreRepository.save(userScore);

      return { correct: isCorrect, points: pointsAwarded };
    } catch (error) {
      console.error('Error saving answer:', error);
      throw new Error('Error occurred while saving the answer');
    }
  }

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
