export const apiRequest = async <T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: Record<string, any>,
    token?: string // Optional token parameter
): Promise<T> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }), // Add Authorization header if token is provided
            },
            body: body ? JSON.stringify(body) : null,
        });

        const data: T = await response.json();

        if (!response.ok) {
            throw new Error(
                data && typeof data === "object" && "message" in data
                    ? (data as any).message
                    : "Something went wrong"
            );
        }

        return data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("An unexpected error occurred");
        }
    }
};
