"use client";

import * as React from "react";
import { askAI } from "@/lib/ai/client";
import type { AIRequestPayload, AIResponse } from "@/lib/types";
import { friendlyAIError } from "./utils";

interface AIRequestState {
  loading: boolean;
  error: string | null;
  result: AIResponse | null;
}

const initialState: AIRequestState = { loading: false, error: null, result: null };

export function useAIRequest() {
  const [state, setState] = React.useState<AIRequestState>(initialState);
  const mounted = React.useRef(true);

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = React.useCallback(async (payload: AIRequestPayload): Promise<AIResponse | null> => {
    setState({ loading: true, error: null, result: null });
    try {
      const response = await askAI(payload);
      if (!mounted.current) return response;
      if (!response.ok || !response.reply.trim()) {
        setState({
          loading: false,
          error: friendlyAIError(response.error),
          result: response,
        });
        return null;
      }
      setState({ loading: false, error: null, result: response });
      return response;
    } catch {
      if (mounted.current) {
        setState({ loading: false, error: "Something went wrong. Please try again.", result: null });
      }
      return null;
    }
  }, []);

  const reset = React.useCallback(() => {
    if (mounted.current) setState(initialState);
  }, []);

  return { ...state, run, reset };
}
