import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "sk-placeholder" });

// Generate a timeline for a dream
export async function generateTimeline(dreamTitle: string, dreamDescription?: string): Promise<{
  tasks: Array<{
    title: string;
    description: string;
    status: "To-Do" | "Doing" | "Done";
    priority: "Low" | "Medium" | "High";
    dueDate?: string;
  }>;
  nextAction: string;
  aiConfidence: number;
}> {
  try {
    const prompt = `
      Create an actionable timeline for this dream: "${dreamTitle}"
      ${dreamDescription ? `Additional context: ${dreamDescription}` : ''}
      
      Respond with JSON in the following format:
      {
        "tasks": [
          {
            "title": "Task name",
            "description": "Brief description of what needs to be done",
            "status": "To-Do",
            "priority": "Medium", 
            "dueDate": "YYYY-MM-DD" (optional, relative to today)
          }
        ],
        "nextAction": "The most important next action to take",
        "aiConfidence": A number between 0 and 100 representing confidence in the timeline
      }
      
      Create 5-7 tasks that represent milestones toward achieving this dream. Organize them in a logical sequence.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert life coach and project planner who specializes in breaking down dreams and goals into actionable steps." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      tasks: result.tasks || [],
      nextAction: result.nextAction || "Start planning your first steps",
      aiConfidence: result.aiConfidence || 75
    };
  } catch (error) {
    console.error("Error generating timeline:", error);
    // Return a fallback response if OpenAI fails
    return {
      tasks: [
        {
          title: "Create an action plan",
          description: "Break down your dream into smaller, achievable goals.",
          status: "To-Do",
          priority: "High",
        }
      ],
      nextAction: "Start by creating an action plan for your dream",
      aiConfidence: 65
    };
  }
}

// Generate resource recommendations for a dream
export async function generateResources(dreamTitle: string, tasks?: Array<any>): Promise<Array<{
  title: string;
  description: string;
  type: "article" | "video" | "tool";
  url: string;
  isVerified: boolean;
  isFree: boolean;
  readTime?: number;
  duration?: number;
}>> {
  try {
    const tasksStr = tasks ? `Related tasks: ${JSON.stringify(tasks)}` : '';
    
    const prompt = `
      Suggest helpful resources for achieving this dream: "${dreamTitle}"
      ${tasksStr}
      
      Respond with JSON in the following format:
      [
        {
          "title": "Resource title",
          "description": "Brief description of the resource",
          "type": "article" or "video" or "tool", 
          "url": "https://example.com", (use real websites that exist)
          "isVerified": boolean indicating if this is from a trusted source,
          "isFree": boolean indicating if this is free or paid,
          "readTime": for articles, estimated reading time in minutes (optional),
          "duration": for videos, duration in minutes (optional)
        }
      ]
      
      Provide 2-4 relevant resources that would help with this dream. Use real websites and resources.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a research expert who finds the most relevant and helpful resources for any goal or project." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "[]");
    
    // Ensure the response is an array
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error generating resources:", error);
    // Return a fallback response with generic resources
    return [
      {
        title: "How to Set Effective Goals",
        description: "A comprehensive guide to setting achievable and measurable goals",
        type: "article",
        url: "https://www.mindtools.com/pages/article/newHTE_90.htm",
        isVerified: true,
        isFree: true,
        readTime: 8
      }
    ];
  }
}

// Analyze dream progress
export async function analyzeDreamProgress(
  dreamTitle: string, 
  tasks: Array<{
    title: string;
    status: "To-Do" | "Doing" | "Done";
  }>
): Promise<{
  progressPercentage: number;
  nextAction: string;
  aiConfidence: number;
}> {
  try {
    const prompt = `
      Analyze progress on this dream: "${dreamTitle}"
      These are the current tasks and their status:
      ${JSON.stringify(tasks)}
      
      Respond with JSON in the following format:
      {
        "progressPercentage": A number between 0 and 100 representing overall progress,
        "nextAction": "The most important next action to take based on current progress",
        "aiConfidence": A number between 0 and 100 representing confidence in this analysis
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an expert analytics coach who specializes in tracking progress and providing helpful advice for achieving goals." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      progressPercentage: result.progressPercentage || 0,
      nextAction: result.nextAction || "Continue working on your current tasks",
      aiConfidence: result.aiConfidence || 70
    };
  } catch (error) {
    console.error("Error analyzing dream progress:", error);
    
    // Calculate basic progress percentage
    const completedTasks = tasks.filter(task => task.status === "Done").length;
    const progressPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
    
    // Return a fallback response
    return {
      progressPercentage,
      nextAction: "Continue working on your tasks in order of priority",
      aiConfidence: 60
    };
  }
}
