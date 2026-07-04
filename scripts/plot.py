import pandas as pd
import matplotlib.pyplot as plt

try:
    df = pd.read_csv('sweep_results.csv')
except FileNotFoundError:
    print("Error: sweep_results.csv not found. Please run the sweep script first to generate it.")
    exit(1)

plt.figure(figsize=(8, 6))

# Extract the number of matches dynamically if column exists, default to 100000
num_matches = int(df['num_matches'].iloc[0]) if 'num_matches' in df.columns else 100000

plt.plot(df['point_win_prob'], df['match_win_prob'], marker='o', color='#3b82f6', linewidth=2, label='Best of 3')
plt.axhline(0.5, color='gray', linestyle='--', alpha=0.5)
plt.axvline(0.5, color='gray', linestyle='--', alpha=0.5)

plt.title(f'Point Win Probability vs. Match Win Probability\nNum simulated matches: {num_matches:,}', fontsize=12, pad=15)
plt.xlabel('Point Win Probability', fontsize=11)
plt.ylabel('Match Win Probability', fontsize=11)
plt.grid(True, alpha=0.3)
plt.legend()

plt.savefig('sweep_plot.png', dpi=300, bbox_inches='tight')
print("Successfully generated and saved plot to sweep_plot.png")
