import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entity/question.entity';
import { Option } from './entity/option.entity';
import { CreateQuestionDto } from './dtos/create_question.dto';
import { SubmitAnswerDto } from './dtos/submit_answer.dto';
import { Answer } from './entity/submit_answer_entity'; 
import { Assessment } from './../assessment/entity/assessment.entity';
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
  ) {}

  // Create a new question with options
  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const { question_text, options, assessment_id } = createQuestionDto;

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
          question: question, // Relating each option to the question
        });
        return option;
      });

      console.log('Saving options...');
      // Save options to the database
      await this.optionsRepository.save(optionsEntities);

      // Update the Question with the correct_option_id
      question.correct_option_id = optionsEntities.find((opt) => opt.is_correct)?.id;
      console.log('Saving question with correct_option_id...');
      await this.questionsRepository.save(question);

      console.log('Question created successfully');
      return question;
    } catch (error) {
      console.error('Error in creating question and options:', error);
      throw error; // Re-throw the error to propagate it
    }
  }
  // Method to handle submitting the answer
  async submitAnswer(question_id: number, option_id: number): Promise<any> {
    try {
      // Find the question
      const question = await this.questionsRepository.findOne({
        where: { id: question_id },
        relations: ['options'],
      });

      // Find the option selected by the user
      const selectedOption = await this.optionsRepository.findOne({
        where: { id: option_id },
      });

      if (!question || !selectedOption) {
        throw new Error('Question or Option not found');
      }

      // Create the answer entity
      const answer = this.answersRepository.create({
        question: question,
        option: selectedOption,
        is_correct: selectedOption.is_correct, // Set correct flag based on option
      });

      // Save the answer to the database
      await this.answersRepository.save(answer);

      // Return a response to indicate if the answer was correct
      return { correct: selectedOption.is_correct };
    } catch (error) {
      console.error('Error saving answer:', error);
      throw error;
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
