import { useState, useEffect } from "react";
import { api } from "../lib/api";

export interface Person {
  id: string;
  name: string;
}

export function usePersons() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [serverDown, setServerDown] = useState(false);

  useEffect(() => {
    api.get("tts/persons").json<Person[]>()
      .then(setPersons)
      .catch(() => setServerDown(true))
      .finally(() => setLoading(false));
  }, []);

  return { persons, loading, serverDown };
}
