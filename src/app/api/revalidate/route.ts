import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get("secret");
    const path = request.nextUrl.searchParams.get("path");

    // Check for secret to confirm this is a valid request
    if (secret !== process.env.REVALIDATION_TOKEN) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    try {
        if (path) {
            // Revalidate specific path if provided
            revalidatePath(path);
            return NextResponse.json({ revalidated: true, path, now: Date.now() });
        } else {
            // Default: Revalidate homepage and all blog posts (simplified by revalidating layout or key paths)
            revalidatePath("/", "layout"); // Revalidate everything
            return NextResponse.json({ revalidated: true, type: "layout", now: Date.now() });
        }
    } catch (err) {
        return NextResponse.json({ message: "Error revalidating", error: err }, { status: 500 });
    }
}
