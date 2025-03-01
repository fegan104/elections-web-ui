'use client'
import { useGetCurrentUsersElections } from "@/data/electionsClient"
import { CircularProgress } from "@mui/material"

export default function ViewElections() {
  const { data, loading, error } = useGetCurrentUsersElections()

  if (loading) {
    return (<CircularProgress />)
  } else if (error) {
    return (<h6>{error}</h6>)
  } else if (data) {
    return (
      <main>
        <div>View Elections</div>
        {JSON.stringify(data)}
      </main>
    )
  }
}