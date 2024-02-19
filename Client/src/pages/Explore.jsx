import { useFetch, useTitle } from "@hooks";
import { pinService } from "@services";
import { useState } from "react";
import { PageLayout } from "@layouts";

export default function Explore() {
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const { pageData, loading } = useFetch(pinService.getRandomPins, currentPage);
  useTitle("Explore random pins");
  console.log("pg", pageData);

  return <PageLayout>Explore</PageLayout>;
}
