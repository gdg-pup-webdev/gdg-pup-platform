import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { Team, TeamInsert, TeamUpdate } from "../types";
import { getCookie } from "cookies-next";

const API_URL = "http://localhost:8000";

export const useTeams = (pageNumber = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["teams", pageNumber, pageSize],
    queryFn: async () => {
      const res = await callEndpoint(API_URL, contract.api.v1.gdg_teams.GET, {
        query: { pageNumber, pageSize },
      });

      if (res.status==200) return res; 

      throw new Error(res.body.message);
    },
  });
};

export const useTeam = (id: string) => {
  return useQuery({
    queryKey: ["team", id],
    queryFn: async () => {
      return await callEndpoint(
        API_URL,
        contract.api.v1.gdg_teams.gdgTeamId.GET,
        {
          params: { gdgTeamId: id },
        },
      );
    },
    enabled: !!id,
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TeamInsert) => {
      return await callEndpoint(API_URL, contract.api.v1.gdg_teams.POST, {
        body: {
          data,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TeamUpdate }) => {
      return await callEndpoint(
        API_URL,
        contract.api.v1.gdg_teams.gdgTeamId.PATCH,
        {
          params: { gdgTeamId: id },
          body: { data },
        },
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["team", variables.id] });
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return await callEndpoint(
        API_URL,
        contract.api.v1.gdg_teams.gdgTeamId.DELETE,
        {
          params: { gdgTeamId: id },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};
