// Import the `withAuth` function from the "next-auth/middleware" module.
import { withAuth } from "next-auth/middleware"

// Export a Higher Order Component (HOC) created using `withAuth`.
export default withAuth({
    // Specify the pages configuration for authentication.
    pages: {
        // When a user needs to sign in, redirect them to the root page ("/").
        signIn: '/'
    }
})

// Export a configuration object for additional settings.
export const config = {
    // Define a URL pattern to match certain routes that require authentication.
    matcher: [
        "/users/:path*", "/conversations/:path*"
    ]
};
