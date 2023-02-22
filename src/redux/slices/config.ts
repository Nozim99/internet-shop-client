import { createSlice } from "@reduxjs/toolkit"
import Cookies from "js-cookie"

const initialState: { token?: string; signIn: boolean, signUp: boolean, name?: string, category?: string } = {
  token: Cookies.get("token"),
  name: Cookies.get("name"),
  signIn: false,
  signUp: false,
  category: undefined
}

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setToken: (state, { payload }: { payload: string[] }) => {
      state.token = payload[0]
      state.name = payload[1]
      Cookies.set("token", payload[0])
      Cookies.set("name", payload[1])
    },
    setSignIn: (state, { payload }: { payload: boolean }) => {
      state.signIn = payload;
    },
    logOut: (state) => {
      state.token = undefined;
      state.name = undefined;
      Cookies.remove("token");
      Cookies.remove("name");
    },
    setSignUp: (state, { payload }: { payload: boolean }) => {
      state.signUp = payload;
    },
    setCategory: (state, { payload }: { payload: string | undefined }) => {
      state.category = payload
    }
  }
})

export const { setToken, setSignIn, setSignUp, setCategory, logOut } = configSlice.actions;
export default configSlice.reducer;