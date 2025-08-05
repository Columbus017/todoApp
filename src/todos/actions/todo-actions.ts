'use server';

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { Todo } from "@prisma/client";

export const toggleTodo = async ( id: string, complete: boolean ): Promise<Todo> => {
    
    const todo = await prisma.todo.findFirst({ where: { id } });

    if (!todo) {
        throw `Todo with id ${id} not found`;
    }

    const updatedTodo = prisma.todo.update({
        where: { id },
        data: { complete}
    });

    revalidatePath('/dashboart/server-todos');

    return updatedTodo;
}

export const addTodo = async ( description: string ) => {
    try {
        const todo = await prisma.todo.create({ data: { description } });

        revalidatePath('/dashboard/server-todos');
        return todo;
    } catch (error) {
        return {
            message: 'Error creating todo',
        }
    }
}

export const deleteTodos = async (): Promise<void> => {
    try {
        await prisma.todo.deleteMany({ where: { complete: true }});
        revalidatePath('/dashboard/server-todos');
    } catch (error) {
        console.error('Error deleting todos:', error);
    }
}