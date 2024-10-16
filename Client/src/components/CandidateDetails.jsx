import React, { useEffect,useState } from "react";
import contract from "../hooks/web3";
function CandidateDetails({candidates}){
 
  return (
    <table className= "table table-hover table-bordered table-striped table-dark my-3">
      <thead>
        <tr>
          <th className="col-3 text-center">ID</th>
          <th className="col-3 text-center">Candidate Name</th>
          <th className="col-3 text-center">Party</th>
          <th className="col-3 text-center">Total Votes</th>
        </tr>
      </thead>
      <tbody>
        {candidates?.map((candidate, index) => {
          if (candidate.name !== "") {
            return (
              <tr key={Number(candidate.id)}>
                <td className="align-content-center">{Number(candidate.id)}</td>
                <td className="align-content-center">{candidate.name}</td>
                <td className="align-content-center">{candidate.party}</td>
                <td className="align-content-center">{Number(candidate.votes)}</td>
              </tr>
            );
          }
        })}
      </tbody>
    </table>
  );
}

export default CandidateDetails;
