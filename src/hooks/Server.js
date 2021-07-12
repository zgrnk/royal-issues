import { useState, useEffect } from 'react';
import axios from "axios";

export function useGetIssues() {
  const [issues, setIssues] = useState(null);
  const token = "INSERT_GITHUB_TOKEN_HERE";
  const url = "https://api.github.com/issues";

  useEffect(() => {
    const getIssues = async () => {
      const resp = await axios.get(url, {headers: {Authorization: `token ${token}`}});
      setIssues(resp.data);
    }
    getIssues();
  }, []);

  return issues;
}
