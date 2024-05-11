import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrdersData } from '@utils-types';

type FeedState = {
  feed: TOrdersData | null;
  loading: boolean;
  error: string | null;
};

const initialState: FeedState = {
  feed: null,
  loading: false,
  error: null
};

export const feedThunk = createAsyncThunk('feed/feedThunk', async () => {
  const data = await getFeedsApi();
  return data;
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    getFeeds: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(feedThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(feedThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.feed = action.payload;
      })
      .addCase(feedThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  }
});

export const { getFeeds } = feedSlice.selectors;
export const feedReducer = feedSlice.reducer;
