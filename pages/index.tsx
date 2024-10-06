"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Github } from "lucide-react"

export default function TennisSimulator() {
  const [probA, setProbA] = useState(0.55)
  const [numMatches, setNumMatches] = useState(1000)
  const [results, setResults] = useState("")
  const [matchScores, setMatchScores] = useState("")

  useEffect(() => {
    if (probA < 0) setProbA(0)
    if (probA > 1) setProbA(1)
  }, [probA])

  function simulatePoint(probA: number) {
    return Math.random() < probA
  }

  function simulateGame(probA: number) {
    let scoreA = 0, scoreB = 0
    while (true) {
      if (simulatePoint(probA)) scoreA++; else scoreB++
      if (scoreA >= 4 && scoreA >= scoreB + 2) return true
      if (scoreB >= 4 && scoreB >= scoreA + 2) return false
    }
  }

  function simulateTiebreak(probA: number) {
    let scoreA = 0, scoreB = 0
    while (true) {
      if (simulatePoint(probA)) scoreA++; else scoreB++
      if (scoreA >= 7 && scoreA >= scoreB + 2) return true
      if (scoreB >= 7 && scoreB >= scoreA + 2) return false
    }
  }

  function simulateSet(probA: number) {
    let gamesA = 0, gamesB = 0
    while (true) {
      if (simulateGame(probA)) gamesA++; else gamesB++
      if (gamesA === 6 && gamesB === 6) {
        return simulateTiebreak(probA) ? [7, 6] : [6, 7]
      }
      if (gamesA >= 6 && gamesA >= gamesB + 2) return [gamesA, gamesB]
      if (gamesB >= 6 && gamesB >= gamesA + 2) return [gamesA, gamesB]
    }
  }

  function simulateMatch(probA: number) {
    let setsA = 0, setsB = 0
    const score = []
    while (setsA < 2 && setsB < 2) {
      const setScore = simulateSet(probA)
      score.push(setScore)
      if (setScore[0] > setScore[1]) setsA++; else setsB++
    }
    return score
  }

  function simulateMatches() {
    let winsA = 0
    let totalGamesA = 0, totalGamesB = 0, totalSets = 0
    let matchScoresText = ""

    for (let i = 0; i < numMatches; i++) {
      const score = simulateMatch(probA)
      const matchResult = score.map(set => set.join('-')).join(' ')
      matchScoresText += `Match ${i + 1}: ${matchResult}\n`

      if (score.filter(set => set[0] > set[1]).length > score.filter(set => set[0] < set[1]).length) {
        winsA++
      }

      totalSets += score.length
      score.forEach(set => {
        totalGamesA += set[0]
        totalGamesB += set[1]
      })
    }

    const winProbA = winsA / numMatches
    const avgGamesPerSetA = totalGamesA / totalSets
    const avgGamesPerSetB = totalGamesB / totalSets

    let resultsText = `Player A won ${winsA} out of ${numMatches} matches.\n`
    resultsText += `Player A match win probability: ${winProbA.toFixed(2)}\n`
    resultsText += `Average games won per set:\n`
    resultsText += `Player A: ${avgGamesPerSetA.toFixed(2)}\n`
    resultsText += `Player B: ${avgGamesPerSetB.toFixed(2)}`

    setResults(resultsText)
    setMatchScores(matchScoresText)
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Tennis Match Simulator</CardTitle>
          <CardDescription>Simulate tennis matches and analyze the results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="probA">Player A win probability per point</Label>
              <Input
                id="probA"
                type="number"
                value={probA}
                onChange={(e) => setProbA(parseFloat(e.target.value))}
                min={0}
                max={1}
                step={0.01}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="probB">Player B win probability per point</Label>
              <Input
                id="probB"
                type="number"
                value={(1 - probA).toFixed(2)}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="numMatches">Number of matches to simulate</Label>
              <Input
                id="numMatches"
                type="number"
                value={numMatches}
                onChange={(e) => setNumMatches(parseInt(e.target.value))}
                min={1}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={simulateMatches}>Simulate Matches</Button>
        </CardFooter>
      </Card>

      {results && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap">{results}</pre>
          </CardContent>
        </Card>
      )}

      {matchScores && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Match Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <pre className="whitespace-pre-wrap">{matchScores}</pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <footer className="mt-8 text-center">
        <a
          href="https://github.com/georgesung/tennis-match-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <Github className="mr-2 h-4 w-4" />
          View source code on GitHub
        </a>
      </footer>
    </div>
  )
}