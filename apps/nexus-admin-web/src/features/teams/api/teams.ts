import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { callEndpointWithToken as callEndpoint } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { Team, TeamInsert, TeamUpdate } from "../types";
import { getCookie } from "cookies-next";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";

const API_URL = "http://localhost:8000";

export const useTeams = (pageNumber = 1, pageSize = 10) => {
  const {token } = useAuthContext();
  return useQuery({
    queryKey: ["teams", pageNumber, pageSize],
    queryFn: async () => {
      const res = await callEndpoint(API_URL, contract.api.v1.gdg_teams.GET, {
        query: { pageNumber, pageSize },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status==200) return res; 

      throw new Error(res.body.message);
    },
  });
};

export const useTeam = (id: string) => {
  const {token } = useAuthContext();
  return useQuery({
    queryKey: ["team", id],
    queryFn: async () => {
      const res = await callEndpoint(
        API_URL,
        contract.api.v1.gdg_teams.gdgTeamId.GET,
        {
          params: { gdgTeamId: id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      
      if (res.status==200) return res; 

      throw new Error(res.body.message);
    },
    enabled: !!id,
  });
};

export const useCreateTeam = () => {
  const {token } = useAuthContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TeamInsert) => {
      return await callEndpoint(API_URL, contract.api.v1.gdg_teams.POST, {
        body: {
          data,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export const useUpdateTeam = () => {
  const {token } = useAuthContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TeamUpdate }) => {
      const res = await callEndpoint(
        API_URL,
        contract.api.v1.gdg_teams.gdgTeamId.PATCH,
        {
          params: { gdgTeamId: id },
          body: { data },
          headers: {
            Authorization: `Bearer ${token}`,
          },

        },
      );
      if (res.status !== 200) throw new Error(res.body.message);
      return res;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["team", variables.id] });
    },
  });
};

export const useDeleteTeam = () => {
  const {token } = useAuthContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await callEndpoint(
        API_URL,
        contract.api.v1.gdg_teams.gdgTeamId.DELETE,
        {
          params: { gdgTeamId: id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.status !== 200) throw new Error(res.body.message);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

// ==========================================
// Team Member Hooks
// ==========================================

export const useAddTeamMember = () => {
  const {token } = useAuthContext();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, userId, position }: { teamId: string; userId: string; position: string }) => {
      const res = await callEndpoint(
        API_URL,
        contract.api.v1.gdg_teams.gdgTeamId.members.POST,
        {
          params: { gdgTeamId: teamId },
          body: {
            data: {
              user_id: userId,
              position,
            },
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },

        },
      );
      if (res.status !== 200) throw new Error(res.body.message);
      return res;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["team", variables.teamId] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export const useUpdateTeamMember = () => {
  const {token } = useAuthContext();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, memberId, position }: { teamId: string; memberId: string; position: string }) => {
      const res = await callEndpoint(
        API_URL,
        contract.api.v1.gdg_teams.gdgTeamId.members.memberId.PATCH,
        {
          params: { gdgTeamId: teamId, memberId },
          body: {
            data: {
              position,
            },
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },

        },
      );
      if (res.status !== 200) throw new Error(res.body.message);
      return res;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["team", variables.teamId] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export const useRemoveTeamMember = () => {
  const {token } = useAuthContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, memberId }: { teamId: string; memberId: string }) => {
      const res = await callEndpoint(
        API_URL,
        contract.api.v1.gdg_teams.gdgTeamId.members.memberId.DELETE,
        {
          params: { gdgTeamId: teamId, memberId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.status !== 200) throw new Error(res.body.message);
      return res;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["team", variables.teamId] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

// ==========================================
// User Hooks (for member selection)
// ==========================================

export const useUsers = (pageNumber = 1, pageSize = 20) => {
  const {token } = useAuthContext();
  return useQuery({
    queryKey: ["users", pageNumber, pageSize],
    queryFn: async () => {
      const res = await callEndpoint(API_URL, contract.api.v1.gdgmembers.GET, {
        query: { pageNumber, pageSize,
          //  sortBy: "name",
            // sortDirection: "asc"
           },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status !== 200) throw new Error(res.body.message);
      return res;
    },
  });
};

export const useSearchUsers = (query: string) => {
  
  const {token } = useAuthContext();
  return useQuery({
    queryKey: ["users", "search", query],
    queryFn: async () => {
      const res = await callEndpoint(API_URL, contract.api.v1.gdgmembers.GET, {
        query: { search: query, pageNumber: 1, pageSize: 10 },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (res.status !== 200) throw new Error(res.body.message);
      return res;
    },
    enabled: query.length >= 2,
  });
};

export const useSearchTeams = (query: string) => {
  
  const {token } = useAuthContext();
  return useQuery({
    queryKey: ["teams", "search", query],
    queryFn: async () => {
      const res = await callEndpoint(API_URL, contract.api.v1.gdg_teams.search.GET, {
        query: { q: query, limit: "10" },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (res.status !== 200) throw new Error(res.body.message);
      return res;
    },
    enabled: query.length >= 2,
  });
};
