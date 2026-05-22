import { Configuration, OpenAIApi } from "openai";
import { NextResponse } from 'next/server';
import {cookies} from 'next/headers'
import jwt from 'jsonwebtoken';
import db_connect from "@/database/db-connection";
import {my_users, my_conversation} from "@/database/models"; 


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


// TO-DO: get token from cookie (see /profile API endpoint example in D2L News)
//        get the user id
//        query the database to ensure the user has access
//        and if doesn't have access then throw a 403 / unauthorized error

export async function POST(req) {
  try {
    // ---------- AUTH ----------
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "JWT secret missing" }, { status: 500 });
    }

    const decoded = jwt.verify(token, secret);

    await db_connect();

    const user = await my_users.findOne({ user_id: decoded.id });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // ---------- REQUEST BODY ----------
    const { system, query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: "Query is blank" }, { status: 400 });
    }

    // ---------- LOAD OR CREATE CONVERSATION ----------
    let conversation = await my_conversation.findOne({
      user_id: decoded.id,
    });

    if (!conversation) {
      conversation = new my_conversation({
        user_id: decoded.id,
        messagesArray: [],
      });
    }

    // ---------- REBUILD CHAT HISTORY ----------
    const messages = [];

    conversation.messagesArray.forEach((msg) => {
      messages.push({
        role: msg.who === "user" ? "user" : "assistant",
        content: msg.dialog,
      });
    });

    // Add system instruction (always fresh)
    messages.push({
      role: "system",
      content: system,
    });

    // Add new user message
    messages.push({
      role: "user",
      content: query,
    });

    const timeAtUserSent = new Date();

    // Save user message to DB
    conversation.messagesArray.push({
      message_id: conversation.messagesArray.length + 1,
      who: "user",
      when: timeAtUserSent,
      dialog: query,
    });

    // ---------- OPENAI CALL ----------
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    const aiReply = completion.data.choices[0].message.content;
    const timeAtAISent = new Date();

    // Save AI response to DB
    conversation.messagesArray.push({
      message_id: conversation.messagesArray.length + 1,
      who: "assistant",
      when: timeAtAISent,
      dialog: aiReply,
    });

    await conversation.save();

    // ---------- RETURN DB AS TRUTH ----------
    return NextResponse.json({
      result: conversation.messagesArray,
    });

  } catch (err) {
    console.error("POST ERROR:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

//a GET endpoint for /chat
export async function GET() {

  // Get token from cookies
  const token = cookies().get('token')?.value; 
  if(!token){ 
    return NextResponse.json({error:'Missing token'},{status:401}); 
  }
  
  // Verify token
  let decoded;
  try {
    // Ensure JWT secret exists
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      return NextResponse.json(
        { error: 'Server misconfiguration: JWT_SECRET missing' },
        { status: 500 }
      );
    }
    decoded = jwt.verify(token, secret); // Validates JWT signature
    // return NextResponse.json(
    //   { user: { id: decoded.id, role: decoded.role } },
    //   { status: 200 }
    // );
  } catch (err) {
    console.error('JWT VERIFY ERROR:', err);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
  }
  // Connects to MongoDB after token pass
  await db_connect();

  // Query DB using decoded.id from JWT
  const user = await my_users.findOne({ user_id: decoded.id });

  //Rejects unknown users
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized user — not found in database" },
      { status: 403 }
    );
  }
  // Connects to MongoDB after token pass
  await db_connect();

  const conversation = await my_conversation.findOne({
    user_id: decoded.id
  });

  return NextResponse.json(conversation?.messagesArray || []);
}