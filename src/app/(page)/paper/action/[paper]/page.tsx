"use client";
import { useParams } from 'next/navigation';

export default function Page() {
  const params = useParams();

  console.log(params.paper)

  return (
    <div>
      <h1>Paper: {params.paper}</h1>
     
    </div>
  );
}