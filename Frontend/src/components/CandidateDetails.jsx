import React, { useEffect,useState } from "react";
import contract from "../hooks/web3";
function CandidateDetails({candidates}){
 
  return (
    <table className="table table-striped my-3">
      <thead>
        <tr>
          <th>ID</th>
          <th>Candidate Name</th>
          <th>Party</th>
          <th>Total Votes</th>
        </tr>
      </thead>
      <tbody>
        {candidates?.map((candidate, index) => {
          if (candidate.name !== "") {
            return (
              <tr key={Number(candidate.id)}>
                <td>{Number(candidate.id)}</td>
                <td>{candidate.name}</td>
                <td>{candidate.party}</td>
                <td>{Number(candidate.votes)}</td>
              </tr>
            );
          }
        })}
      </tbody>
    </table>
  );
}

export default CandidateDetails;
