import { StatusCodes } from 'http-status-codes';
import { ApiError, asyncHandler, handleResponse } from '../utils/index.js';
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Quiz } from '../models/quiz.models.js';
import { QUIZ_TYPE, TopicQuizPrompt } from '../constants.js';
import { getTopicByName } from './topic.controller.js';

const generateQuiz = asyncHandler(async (req, res) => {
    const { topics } = req.body;

    if (!Array.isArray(topics) || topics.length === 0) {
        return handleResponse(
            res,
            StatusCodes.BAD_REQUEST,
            null,
            'Topics must be a non-empty array'
        );
    }

    const google = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_GENERATIVE_API_KEY,
    });

    try {
        const { text } = await generateText({
            model: google.languageModel('gemini-1.5-flash'),
            system: 'You are skilled instructor on EDTech platform where students can see your videos. you have to generate meaningful quiz for the exam of the students from the transcription and topics  of the video. The quiz should cover all the topics that are included in transcription and topics that are given',
            temperature: 0.7,
            prompt: `
    	    please convert this transcription into a well-structured quiz follow this structure:

    	    The Quiz should be in the form of Array. in which the options could be array of four options.

    		1. Create 20-25 questions covering all the topics in the transcription.
            2. Each question should have four options, with one correct answer.
            3. Provide a short explanation for the correct answer.
            4. Randomize the position of the correct answer to avoid patterns.
    		6. Do not make quiz on specific video.
            7. Make difficulty level as hard level.
            5. Format each question as a JSON object as follows:

    		{
    			"Q": "[Question text]",
    			"A": "[Option 1]",
    			"B": "[Option 2]",
    			"C": "[Option 3]",
    			"D": "[Option 4]",
    			"Correct": "[A, B, C, or D]",
    			"Explanation": "[Brief explanation of the correct answer]"
            }

            6. Separate each question object with a line containing only "---".
            7. Ensure the entire response is valid JSON when the separators are removed.

                Here's the topic for this video: ${topics}
                `,
        });

        // const quizData = JSON.parse(text);
        const quizData = parseQuizResponse(text);

        handleResponse(
            res,
            StatusCodes.CREATED,
            quizData,
            'Quiz generated successfully'
        );
    } catch (error) {
        console.log(error);
        throw new ApiError(StatusCodes.NOT_FOUND, 'Quiz is not generated');
    }
});

function parseQuizResponse(response) {
    // Remove any Markdown code block syntax
    const cleanedResponse = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '');

    // Split the response into individual JSON objects
    const jsonObjects = cleanedResponse
        .split('---')
        .map((s) => s.trim())
        .filter(Boolean);

    // Parse each JSON object and convert to the desired format
    return jsonObjects
        .map((jsonString) => {
            try {
                const item = JSON.parse(jsonString);
                return {
                    question: item.Q,
                    options: [item.A, item.B, item.C, item.D],
                    answer: ['A', 'B', 'C', 'D'].indexOf(item.Correct),
                    explanation: item.Explanation,
                };
            } catch (error) {
                console.error('Error parsing JSON object:', error);
                console.error('Problematic JSON string:', jsonString);
                return null;
            }
        })
        .filter((item) => item !== null); // Remove any null items due to parsing errors
}

const generateTopicQuiz = asyncHandler(async (req, res) => {
    const { topics } = req.body;

    if (!Array.isArray(topics) || topics.length === 0)
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Topics must be a non-empty array'
        );

    const google = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_GENERATIVE_API_KEY,
    });

    console.log('Generating quiz...');

    try {
        const { text } = await generateText({
            model: google.languageModel('gemini-1.5-flash'),
            system: 'You are skilled instructor on EDTech platform where students can see your content. you have to generate meaningful quiz for the exam of the students from the given topics. The quiz should cover all the topics that are included in Technology Skill topic and topics that are given',
            temperature: 0.7,
            prompt:
                TopicQuizPrompt +
                ` Here's the topic for this quiz exam: ${topics}`,
        });

        const quizData = parseQuizResponse(text);

        console.log(quizData);

        handleResponse(
            res,
            StatusCodes.CREATED,
            quizData,
            'Quiz generated successfully'
        );
    } catch (error) {
        console.log(error);
        throw new ApiError(StatusCodes.NOT_FOUND, 'Quiz is not generated');
    }
});

const generateCourseQuiz = asyncHandler(async (req, res) => {
    const { topics } = req.body;

    if (!Array.isArray(topics) || topics.length === 0)
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Topics must be a non-empty array'
        );

    const google = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_GENERATIVE_API_KEY,
    });

    try {
        const { text } = await generateText({
            model: google.languageModel('gemini-1.5-flash'),
            system: 'You are skilled instructor on EDTech platform where students can see your content. you have to generate meaningful quiz for the exam of the students from the given topics. The quiz should cover all the topics that are included in Technology Skill topic and topics that are given',
            temperature: 0.7,
            prompt:
                TopicQuizPrompt +
                ` Here's the topic for this quiz exam: ${topics}`,
        });

        // const quizData = JSON.parse(text);
        const quizData = parseQuizResponse(text);

        handleResponse(
            res,
            StatusCodes.CREATED,
            quizData,
            'Quiz generated successfully'
        );
    } catch (error) {
        console.log(error);
        throw new ApiError(StatusCodes.NOT_FOUND, 'Quiz is not generated');
    }
});

const createQuiz = async (name, type, identifierId) => {
    try {
        const quizData = { name, type };

        if (type === QUIZ_TYPE.COURSE_COMPLETION) {
            quizData.course = identifierId;
        } else if (type === QUIZ_TYPE.TOPIC) {
            quizData.topic = identifierId;
        }

        const quiz = await Quiz.create(quizData);

        return quiz;
    } catch (error) {
        return null;
    }
};

const getQuizByTopicId = async (topicId) => {
    try {
        const quiz = await Quiz.findOne({
            topic: topicId,
            type: QUIZ_TYPE.TOPIC,
        });
        return quiz;
    } catch (error) {
        console.log(error.message);
        return null;
    }
};

const getQuizByTopicName = async (topicName) => {
    try {
        const topic = await getTopicByName(topicName);
        if (!topic) return null;

        const quiz = await Quiz.findOne({
            topic: topic._id,
            type: QUIZ_TYPE.TOPIC,
        });

        return quiz;
    } catch (error) {
        console.log(error.message);
        return null;
    }
};

const getQuizByCourseId = async (courseId) => {
    try {
        const quiz = await Quiz.findOne({
            course: courseId,
            type: QUIZ_TYPE.COURSE_COMPLETION,
        });
        return quiz;
    } catch (error) {
        console.log(error.message);
        return null;
    }
};

export default {
    generateQuiz,
    generateTopicQuiz,
    generateCourseQuiz,
    createQuiz,
    getQuizByTopicId,
    getQuizByTopicName,
    getQuizByCourseId,
};
