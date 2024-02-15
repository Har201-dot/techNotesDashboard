import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.NODE_ENV === "production" ? "https://technotesapi1-4u03r096.b4a.run" : "http://localhost:3500",
	credentials: "include",
	prepareHeaders: (headers, { getState }) => {
		const token = getState().auth.token; // check if the store has token in auth slice or not

		if (token) headers.set("authorization", `Bearer ${token}`); // if it has then add it to headers
		return headers;
	},
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);

	if (result?.error?.status === 403) {
		console.log("Sending refresh token");

		const refreshResult = await baseQuery("auth/refresh", api, extraOptions);

		if (refreshResult?.data) {
			api.dispatch(setCredentials({ ...refreshResult.data }));

			result = await baseQuery(args, api, extraOptions);
		} else {
			if (refreshResult?.error?.status === 403) {
				refreshResult.error.data.message = "Your login has expired. ";
			}
			return refreshResult;
		}
	}

	return result;
};

export const apiSlice = createApi({
	baseQuery: baseQueryWithReauth,
	tagTypes: ["Note", "User"],
	endpoints: (builder) => ({}),
});
