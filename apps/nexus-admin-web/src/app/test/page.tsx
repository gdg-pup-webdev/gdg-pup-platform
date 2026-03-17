"use client";

import { contract } from '@packages/nexus-api-contracts'
import { callEndpoint } from '@packages/typed-rest/clientReact'
import React from 'react'

const page = () => {

    const handleTest = async () => {
        const result = await callEndpoint(
            "http://localhost:8000",
            contract.api.v1.gdg_teams.POST,
            {
                body: {
                    data: {
                        name: "tedfadfadafdsafdsfadssst",
                        description: "test",
                    }
                }
            }
        )

        console.log(result)

        // const res = await fetch( "http://localhost:8000/api/v1/gdg-teams", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         data: {
        //             name: "test",
        //             description: "test",
        //         }
        //     })
        // })

        // console.log(res.json())
    }


  return (
    <>
    
    
    <div>page</div>
    <button onClick={handleTest} className='p-4 border bg-green-300'>Test</button>
    
    </>
  )
}

export default page