import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchFlightBriefing, BriefingApiResponse } from '@/lib/fetchers/briefing';
import type { Waypoint } from '@/components/dashboard/flight-planning'; // Assuming Waypoint type is here

export function useWeatherBriefingContext() {
  const [planString, setPlanString] = useState<string | null>(null);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedPlanRaw = localStorage.getItem('flightPlanWaypoints');
      if (savedPlanRaw) {
        const parsedWaypoints: Waypoint[] = JSON.parse(savedPlanRaw);
        if (Array.isArray(parsedWaypoints) && parsedWaypoints.length > 0) {
          const currentPlanString = parsedWaypoints
            .map(wp => `${wp.airport},${wp.altitude}`)
            .join(',');
          setWaypoints(parsedWaypoints);
          setPlanString(currentPlanString);
          setInitializationError(null); // Clear error if successful
        } else {
           setInitializationError("No valid flight plan found in storage.");
           setWaypoints([]);
           setPlanString(null);
        }
      } else {
        setInitializationError("No flight plan saved in storage. Please create one first.");
        setWaypoints([]);
        setPlanString(null);
      }
    } catch (error) {
      console.error("Failed to load or parse flightPlanWaypoints:", error);
      setInitializationError("Error loading flight plan from storage.");
      setWaypoints([]);
      setPlanString(null);
    }
  }, []); // Run once on mount

  const { 
    data: briefingData, 
    isLoading: isLoadingBriefing, 
    isError: isBriefingError, 
    error: briefingError, 
    refetch
  } = useQuery<BriefingApiResponse, Error>({
    queryKey: ['flightBriefingContext', planString], // Use planString in key
    queryFn: () => fetchFlightBriefing(planString!), // Fetch using the derived planString
    enabled: !!planString, // Only run query if planString is available
    staleTime: 5 * 60 * 1000, 
    refetchOnWindowFocus: false, 
  });

  // Consolidate loading and error states
  const isLoading = isLoadingBriefing || (!briefingData && !isBriefingError && !initializationError && !!planString);
  const isError = isBriefingError || !!initializationError;
  const error = briefingError || (initializationError ? new Error(initializationError) : null);

  return { 
    briefingData, 
    waypoints,
    planString,
    isLoading, 
    isError, 
    error, 
    refetch
  };
} 