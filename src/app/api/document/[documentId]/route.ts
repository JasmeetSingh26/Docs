import { db } from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { documentId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("User Not Authenticated", { status: 401 });
    }
    revalidatePath("/document");

    const { title, description } = await req.json();
    revalidatePath("/document");

    const updateDocument = await db.document.update({
      where: {
        id: params.documentId,
        userId: userId,
      },
      data: {
        title: title,
        description: description,
      },
    });
    revalidatePath("/document");


    return new NextResponse("Succesfully updated data", { status: 200 });
  } catch (error) {
    return new NextResponse("PUT Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { documentId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("User Not Authenticated", { status: 401 });
    }
    
    const deleteDocument = await db.document.delete({
      where: {
        id: params.documentId,
        userId: userId,
      },
    });
    revalidatePath("/");
    revalidatePath("/document");

    return new NextResponse("Succesfully Deleted data", { status: 200 });
  } catch (error) {
    return new NextResponse("DELETE Error", { status: 500 });
  }
}
