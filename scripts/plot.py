import os
import pandas as pd
import matplotlib.pyplot as plt

# Ensure output directory exists
output_dir = 's_curve_data'
os.makedirs(output_dir, exist_ok=True)

csv_path = os.path.join(output_dir, 'sweep_results.csv')
try:
    df = pd.read_csv(csv_path)
except FileNotFoundError:
    print(f"Error: {csv_path} not found. Please run the sweep script first.")
    exit(1)

num_matches = int(df['num_matches'].iloc[0]) if 'num_matches' in df.columns else 100000

def create_comparison_plot(filename, title_suffix, plots_to_draw):
    """
    plots_to_draw is a list of tuples: (y_col_name, label_name, color, line_style)
    """
    plt.figure(figsize=(8, 6))

    # Plot the requested lines
    for col, label, color, style in plots_to_draw:
        plt.plot(df['point_win_prob'], df[col], marker='o', color=color, linestyle=style, linewidth=2, label=label)

    plt.axhline(0.5, color='gray', linestyle='--', alpha=0.5)
    plt.axvline(0.5, color='gray', linestyle='--', alpha=0.5)

    title = f'Point Win Probability vs. Match Win Probability\n{title_suffix}\nNum simulated matches: {num_matches:,}'
    plt.title(title, fontsize=12, pad=15)
    plt.xlabel('Point Win Probability', fontsize=11)
    plt.ylabel('Match Win Probability', fontsize=11)
    plt.grid(True, alpha=0.3)
    plt.legend()

    output_path = os.path.join(output_dir, filename)
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Successfully generated and saved plot to {output_path}")

# 1. Control Plot
create_comparison_plot(
    'control_plot.png',
    '(Control Settings)',
    [('default_match_win_prob', 'Standard match', '#3b82f6', '-')]
)

# 2. Best of 5 Comparison
create_comparison_plot(
    'best_of_5_comparison.png',
    '(Best of 3 vs. Best of 5 Sets)',
    [
        ('default_match_win_prob', 'Best of 3', '#3b82f6', '-'),
        ('best_of_5_match_win_prob', 'Best of 5', '#ef4444', '--')
    ]
)

# 3. No-Ad Comparison
create_comparison_plot(
    'no_ad_comparison.png',
    '(Standard With-Ad vs. No-Ad Scoring)',
    [
        ('default_match_win_prob', 'Ad Scoring', '#3b82f6', '-'),
        ('no_ad_match_win_prob', 'No Ad', '#10b981', '--')
    ]
)

# 4. Match Tiebreak Comparison
create_comparison_plot(
    'match_tiebreak_comparison.png',
    '(Standard Final Set vs. 10-Pt Match Tiebreak)',
    [
        ('default_match_win_prob', 'Full 3rd Set', '#3b82f6', '-'),
        ('match_tiebreak_match_win_prob', 'Match Tiebreak (to 10)', '#8b5cf6', '--')
    ]
)

# 5. Fast 4 Comparison
create_comparison_plot(
    'fast_four_comparison.png',
    '(Standard 6-Game Sets vs. Fast 4 Format)',
    [
        ('default_match_win_prob', 'Standard Sets', '#3b82f6', '-'),
        ('fast_four_match_win_prob', 'Fast 4', '#f59e0b', '--')
    ]
)
