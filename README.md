# Tennis match simulator
http://www.georgesung.com/tennis-match-simulator/

Ever wondered:
- What percentage of matches would I win if I "only" won 55% of the points?
- What percentage of points do I need to win to get just one game off a much better player?
- If I usually win/lose 10-5 when playing practice tiebreaks with my friend, what is my expected match score in a full match?

Example screenshot:

<img src="demo.png" alt="demo" style="max-height: 500px;"/>

Given the win probability of a player on each point, simulate multiple tennis matches and analyze the results.

In this simple web app, you can specify the per-point win probability of a player, and the number of matches to simulate. After the simulations are complete, you can see the number of matches won, and other interesting stats. All the logic runs inside your own browser.

This web app uses Next.js and shadcn/ui

**Simulation caveats:**
This simulation assumes every point has an equal win probability for a given player. It does not take into account different win probabilities when serving/receiving, when the score is close and a player is nervous, players tanking when it's a blowout, etc.

### Point Win Probability vs. Match Win Probability (The S-Curve)

Under standard rules (Best of 3 sets, standard With-Ad scoring, full 3rd set), a slight edge in point-win probability is dramatically amplified into a massive match-win probability. This is the classic **S-Curve** of tennis scoring:
- If Player A has a **50%** chance of winning any individual point, they have exactly a **50%** chance of winning the match.
- If Player A's point-win probability increases by just 3% to **53%**, the scoring system amplifies this slight edge into an overwhelming **~79%** match-win probability.

Here are some more results, based on 100,000 simulated matches for each row.
(TODO: clean up this table's formatting!)
Win probability per point (%)	Match win probability (%)	Expected games per set
50	50	4.83 - 4.84
51	60	5.06 - 4.58
52	70	5.26 - 4.31
53	79	5.45 - 4.02
54	86	5.59 - 3.75
55	91	5.71 - 3.45
60	100 (rounded)	5.98 - 2.15 <-- 6-2 expected set score
67 <-- winning 10-5 in a tiebreak	100	6.00 - 0.97 <-- 6-1 expected set score
72	100	6.00 - 0.50 <-- expect to get one game in a match
(end TODO)

This simulator allows us to change match settings by toggling different variables (such as Best of 5 sets, No-Ad scoring, Match Tiebreak to 10 points in the final set, and the Fast 4 format). Below is an overall overlay comparing how each of these scoring variations alters the S-Curve behavior relative to the standard setup:

![Tennis S-Curve Comparison Plot](./s_curve_data/overall_comparison.png)

From this chart, we can observe interesting scoring effects:
- **Best of 5 sets (red dashed line)** makes the S-curve even steeper, further rewarding the player with the statistical point edge.
- **Fast 4 (yellow dashed line)**, **Match Tiebreak to 10 (purple dotted line)**, and **No-Ad scoring (green dash-dot line)** reduce the number of points/games played, which introduces more variance and flattens the S-curve (giving the underdog a better chance).

## Local development
```
npm install
npm run dev
```

Go to `http://localhost:3000`.

## Deploy to GitHub Pages
You can host this simple web app for free on GitHub Pages, see instructions [here](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site). In the GitHub Pages settings, select "GitHub Actions" for build & deployment, and from there you can choose the default next.js app deployment setup.

## Batch Simulation & Sweeping
If you want to run parameter sweeps in an offline batch way to study the behavior of the S-curve under different game rules, you can use the standalone CLI scripts. Both the web UI and these offline scripts share the same modular simulation core located in `lib/simulator.ts` to ensure 100% logic consistency.

### 1. Run the Parameter Sweep
Run the TypeScript sweep script to simulate 5 distinct configurations (Standard match, Best of 5, No Ad, Match Tiebreak to 10, and Fast 4) across a range of point-win probabilities (0.40 to 0.60, 100,000 matches per step):
```bash
npx -y tsx scripts/sweep.ts
```
This generates a consolidated CSV database in `s_curve_data/sweep_results.csv`.

### 2. Plot the Results
Use the Python plotting script to parse the CSV and generate high-quality comparison curves:
```bash
python3 scripts/plot.py
```

This generates 6 comparison plots in the `s_curve_data/` directory:
- `control_plot.png` — Standard Best of 3 S-Curve control plot.
- `best_of_5_comparison.png` — Standard Best of 3 vs. Best of 5 Sets overlay.
- `no_ad_comparison.png` — Standard Ad vs. No-Ad scoring overlay.
- `match_tiebreak_comparison.png` — Standard 3rd Set vs. 10-Pt Match Tiebreak overlay.
- `fast_four_comparison.png` — Standard 6-Game Sets vs. Fast 4 Format overlay.
- `overall_comparison.png` — Master comparison overlay plot showing **all** scenarios together!

## Why did I build this?
I've always felt like writing a simulator for this, since I've been curious about these questions for a long time (see above). However, I've been very lazy to put this together.

Good news though: AI has gotten very good at coding simple things like this (I'm writing this on October 6, 2024). So when having my Sunday morning coffee, I played around with GPT 4o w/ Canvas, and got it to write a python simulator for tennis matches (conversation [here](https://chatgpt.com/share/6702697b-7770-800d-8289-e42a164c955d)). Before I even finished my coffee, the AI helped me write a valid simulator. There were some mistakes along the way so I had to iterate a bit, but overall it was pretty smooth. You can see the final python script [here](https://gist.github.com/georgesung/42387a7208ddc648b334716d6bf406e2). Since this is a python script, I am able to run it on my laptop, but what if this can run in any web browser?

Recently I've been learning some front-end development, so I thought it might be fun to build a simple web app to do this. I want all the logic to run in the user's browser so I can host a static website for free on GitHub Pages (I'm not paying any 💰💰 for this). I've been working with Next.js and shadcn/ui on a separate project, so I thought I'll stick with these libraries. So I went to the trusty Vercel v0 and asked it to help build my web app for me. I described the overall desired functionality and gave it some example inputs and outputs. Impressively, v0 got the simulation logic right the first try! It did a better job than GPT 4o w/ Canvas 😀 I didn't even need to show the final python code from above and have it convert that to typescript, that was nice. Thus, most of my conversation with v0 was about iterating on the UI itself. The converations are [here](https://v0.dev/chat/aP0kDHVyXOf), [here](https://v0.dev/chat/k13Zrq0Tiq6), and [here](https://v0.dev/chat/uYUsuYOAwvL).

After that I went through a bunch of back and forth to figure out how to deploy this on GitHub Pages: a mix of asking ChatGPT and Perplexity a bunch of questions, old-fashioned Googling, and just randomly clicking around in GitHub. Actually randomly clicking around on GitHub is how I found it has a pre-made GitHub Actions template to deploy Next.js apps -- super helpful.
