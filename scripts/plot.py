import pandas as pd
import matplotlib.pyplot as plt

try:
    df = pd.read_csv('sweep_results.csv')
except FileNotFoundError:
    print("Error: sweep_results.csv not found. Please run the sweep script first to generate it.")
    exit(1)

plt.figure(figsize=(8, 6))
plt.plot(df['point_win_prob'], df['match_win_prob'], marker='o', color='#3b82f6', linewidth=2, label='Simulation (Best of 3)')
plt.axhline(0.5, color='gray', linestyle='--', alpha=0.5)
plt.axvline(0.5, color='gray', linestyle='--', alpha=0.5)

plt.title('Player A Point Win Probability vs. Match Win Probability', fontsize=14, pad=15)
plt.xlabel('Player A Point Win Probability (x)', fontsize=12)
plt.ylabel('Player A Match Win Probability (y)', fontsize=12)
plt.grid(True, alpha=0.3)
plt.legend()

# Annotate key points
plt.annotate('Even match (0.5, 0.5)', xy=(0.5, 0.5), xytext=(0.51, 0.45),
             arrowprops=dict(facecolor='black', shrink=0.05, width=1, headwidth=6))

# Highlight the S-curve scaling effect
plt.annotate('Amplification effect', xy=(0.55, 0.90), xytext=(0.42, 0.85),
             arrowprops=dict(facecolor='green', shrink=0.05, width=1, headwidth=6))

plt.savefig('sweep_plot.png', dpi=300, bbox_inches='tight')
print("Successfully generated and saved plot to sweep_plot.png")
