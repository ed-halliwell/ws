import { sql } from 'slonik';
import { Context } from './messages.controller';

export interface Message {
  readonly id: string;
  readonly content: string;
  readonly created: string;
  readonly userId: string;
}

export const insertMessage = async (message: Message, context: Context): Promise<boolean> => {
  const pool = await context.db.connect();
  try {
    const createMessage = sql.fragment`
        INSERT INTO messages (id, content, created, user_id)
        VALUES (${message.id}, ${message.content}, ${message.created}, ${message.userId});
      `;

    await pool.query(createMessage.sql, [...createMessage.values]);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getMessages = async (context: Context): Promise<Message[]> => {
  const pool = await context.db.connect();
  try {
    const messages = await pool.query(
      `SELECT id, content, created, user_id as "userId" FROM messages`,
    );
    return !messages.rowCount ? [] : (messages.rows as Message[]);
  } catch (error) {
    console.error(error);
    return [];
  }
};
