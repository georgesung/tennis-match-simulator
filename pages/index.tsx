"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Github, Settings } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function TennisSimulator() {
  const [probA, setProbA] = useState(0.55)
  const [numMatches, setNumMatches] = useState(10000)
  const [results, setResults] = useState("")
  const [matchScores, setMatchScores] = useState("")
  const [noAdScoring, setNoAdScoring] = useState(false)
  const [matchTiebreak, setMatchTiebreak] = useState(false)
  const [fastFour, setFastFour] = useState(false)

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
      if (noAdScoring && scoreA === 3 && scoreB === 3) {
        return simulatePoint(probA)
      }
      if (scoreA >= 4 && scoreA >= scoreB + 2) return true
      if (scoreB >= 4 && scoreB >= scoreA + 2) return false
    }
  }

  function simulateTiebreak(probA: number, points: number) {
    let scoreA = 0, scoreB = 0
    while (true) {
      if (simulatePoint(probA)) scoreA++; else scoreB++
      if (scoreA >= points && scoreA >= scoreB + 2) return true
      if (scoreB >= points && scoreB >= scoreA + 2) return false
    }
  }

  function simulateSet(probA: number) {
    let gamesA = 0, gamesB = 0
    const gamesNeeded = fastFour ? 4 : 6
    const tiebreakAt = fastFour ? 3 : 6

    while (true) {
      if (simulateGame(probA)) gamesA++; else gamesB++
      if (gamesA === tiebreakAt && gamesB === tiebreakAt) {
        return simulateTiebreak(probA, 7) ? [gamesA + 1, gamesB] : [gamesA, gamesB + 1]
      }
      if (gamesA >= gamesNeeded && gamesA >= gamesB + 2) return [gamesA, gamesB]
      if (gamesB >= gamesNeeded && gamesB >= gamesA + 2) return [gamesA, gamesB]
      if (fastFour && (gamesA === 4 || gamesB === 4)) return [gamesA, gamesB]
    }
  }

  function simulateMatch(probA: number) {
    let setsA = 0, setsB = 0
    const score = []
    while (setsA < 2 && setsB < 2) {
      if (matchTiebreak && setsA === 1 && setsB === 1) {
        const tiebreakResult = simulateTiebreak(probA, 10)
        score.push(tiebreakResult ? [1, 0] : [0, 1])
        return score
      }
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
    resultsText += `Player A match win probability: ${winProbA.toFixed(4)}\n`
    resultsText += `Average games won per set:\n`
    resultsText += `Player A: ${avgGamesPerSetA.toFixed(2)}\n`
    resultsText += `Player B: ${avgGamesPerSetB.toFixed(2)}\n`
    resultsText += `No-Ad Scoring: ${noAdScoring ? 'On' : 'Off'}\n`
    resultsText += `Match Tiebreak: ${matchTiebreak ? 'On' : 'Off'}\n`
    resultsText += `Fast 4 Format: ${fastFour ? 'On' : 'Off'}`

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
                value={(1 - probA).toFixed(4)}
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
        <CardFooter className="justify-between">
          <Button onClick={simulateMatches}>Simulate Matches</Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Advanced Settings
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Advanced Settings</SheetTitle>
                <SheetDescription>
                  Configure advanced options for the tennis match simulation.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="no-ad-scoring"
                    checked={noAdScoring}
                    onCheckedChange={setNoAdScoring}
                  />
                  <Label htmlFor="no-ad-scoring">No-Ad Scoring</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="match-tiebreak"
                    checked={matchTiebreak}
                    onCheckedChange={setMatchTiebreak}
                  />
                  <Label htmlFor="match-tiebreak">Match Tiebreak</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="fast-four"
                    checked={fastFour}
                    onCheckedChange={setFastFour}
                  />
                  <Label htmlFor="fast-four">Fast 4 Format</Label>
                </div>
              </div>
            </SheetContent>
          </Sheet>
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