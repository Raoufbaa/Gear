import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const option = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email:",
          type: "email",
          placeholder: "Enter Your Email",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "Enter Your Password",
        },
      },
      async authorize(credentials, req) {
        // console.log("reqq", req);
        try {
          // Make a POST request to your API for authentication
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND}/store/auth`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Error in /store/auth API call");
          }

          const users = await response.json();
          // console.log("user", users);

          // If the user is authenticated successfully, make another request to get the token
          const tokenResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND}/store/auth/token`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!tokenResponse.ok) {
            throw new Error("Error in /store/auth/token API call");
          }

          const toke = await tokenResponse.json();
          // console.log("token", toke);
          const accessToken = toke.access_token;

          // Merge user and accessToken into a single object
          const user = {
            user: users,
            accessToken: accessToken,
          };

          return user; // Return an object containing both the user and the token
        } catch {
          return null;
        }
      },
    }),
  ],
  theme: {
    colorScheme: "auto",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        const customerData = user?.user?.customer;
        if (customerData) {
          token.id = customerData.id;
          token.name = customerData.first_name;
          token.Last_name = customerData.last_name;
          token.email = customerData.email;
          token.phone = customerData.phone;
          token.accessToken = user.accessToken;
        } else {
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;
          token.image = user.image;
        }
      }
      return token;
    },
    async session({ session, token, user }) {
      // console.log("token inside session ", token);
      // console.log("acccount inside jwt", token);
      // console.log("user inside jwt", user);
      session.id = token.id;
      session.name = token.name;
      session.Last_name = token.Last_name;
      session.email = token.email;
      session.phone = token.phone;
      session.image = token.image;
      session.accessToken = token.accessToken;

      return session;
    },
  },
};
