#!/usr/bin/env python3
"""
Build research-grade ASTER and MAIEA architecture diagrams.
Uses matplotlib for full control over styling — no LaTeX dependencies needed.
"""

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import numpy as np
import os
from pathlib import Path

OUTPUT_DIR = Path(__file__).resolve().parent / "diagram_outputs"
OUTPUT_DIR.mkdir(exist_ok=True)
os.chdir(OUTPUT_DIR)

# ═══════════════════════════════════════════════
# Colour palette — projector-safe, research-clean
# ═══════════════════════════════════════════════
C = {
    "user_fill": "#DBEAFE", "user_edge": "#2563EB", "user_text": "#1E40AF",
    "agent_fill": "#EDE9FE", "agent_edge": "#7C3AED", "agent_text": "#5B21B6",
    "tool_fill": "#FFF7ED", "tool_edge": "#EA580C", "tool_text": "#C2410C",
    "data_fill": "#CCFBF1", "data_edge": "#0D9488", "data_text": "#0F766E",
    "out_fill": "#F1F5F9", "out_edge": "#475569", "out_text": "#334155",
    "skill_fill": "#FEF3C7", "skill_edge": "#B45309", "skill_text": "#92400E",
    "fw_fill": "#F3F4F6", "fw_edge": "#6B7280", "fw_text": "#4B5563",
    "ext_fill": "#F9FAFB", "ext_edge": "#9CA3AF",
    "cloud_fill": "#EDE9FE", "cloud_edge": "#8B5CF6", "cloud_text": "#6D28D9",
    "noise_fill": "#FFF1F2", "noise_edge": "#E11D48", "noise_text": "#BE123C",
    "proxy_fill": "#FEF3C7", "proxy_edge": "#D97706", "proxy_text": "#B45309",
    "grid_fill": "#CFFAFE", "grid_edge": "#0891B2", "grid_text": "#0E7490",
    "new_fill": "#D1FAE5", "new_edge": "#059669", "new_text": "#047857",
    "hermes_fill": "#E0E7FF", "hermes_edge": "#4338CA", "hermes_text": "#3730A3",
    "limit_fill": "#FEF2F2", "limit_edge": "#DC2626",
    "bg": "#FAFAF9",
}


def draw_box(ax, x, y, w, h, fill, edge, text, label, fontsize=7.5,
             lw=1.2, radius=0.015, bold=True, sublabel=None, badge=None, zorder=2):
    """Draw a rounded rectangle with centered text."""
    box = FancyBboxPatch(
        (x - w/2, y - h/2), w, h,
        boxstyle=f"round,pad=0,rounding_size={radius}",
        facecolor=fill, edgecolor=edge, linewidth=lw, zorder=zorder,
        transform=ax.transData
    )
    ax.add_patch(box)
    weight = "bold" if bold else "normal"
    ax.text(x, y + (0.012 if sublabel else 0), label,
            ha="center", va="center", fontsize=fontsize,
            fontweight=weight, color=text, zorder=zorder+1)
    if sublabel:
        ax.text(x, y - 0.018, sublabel,
                ha="center", va="center", fontsize=5.5,
                color=text, alpha=0.75, zorder=zorder+1)
    if badge:
        bx = x + w/2 - 0.005
        by = y + h/2 - 0.005
        bp = FancyBboxPatch(
            (bx - 0.022, by - 0.008), 0.044, 0.016,
            boxstyle="round,pad=0,rounding_size=0.004",
            facecolor="#059669", edgecolor="none", zorder=zorder+2
        )
        ax.add_patch(bp)
        ax.text(bx, by, badge, ha="center", va="center",
                fontsize=4, fontweight="bold", color="white", zorder=zorder+3)
    return box


def draw_arrow(ax, x1, y1, x2, y2, color="#475569", lw=0.8, style="-",
               head_width=0.006, zorder=1):
    """Draw an arrow between two points."""
    dx = x2 - x1
    dy = y2 - y1
    ax.annotate("", xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle="-|>", color=color,
                                lw=lw, linestyle=style,
                                mutation_scale=8),
                zorder=zorder)


def draw_elbow(ax, x1, y1, xm, ym, x2, y2, color="#475569", lw=0.8,
               style="-", zorder=1):
    """Draw an L-shaped arrow with a midpoint."""
    ax.plot([x1, xm], [y1, ym], color=color, lw=lw, linestyle=style,
            solid_capstyle="round", zorder=zorder)
    draw_arrow(ax, xm, ym, x2, y2, color=color, lw=lw, style=style,
               zorder=zorder)


def draw_label(ax, x, y, text, color="#475569", fontsize=6.5,
               bold=True, ha="left"):
    weight = "bold" if bold else "normal"
    ax.text(x, y, text, ha=ha, va="center", fontsize=fontsize,
            fontweight=weight, fontstyle="italic", color=color)


def draw_annotation(ax, x, y, w, lines, edge, fill, text_color,
                    fontsize=5.5, title=None):
    """Draw a multi-line annotation box."""
    line_h = 0.018
    h = len(lines) * line_h + 0.025
    if title:
        h += 0.015
    box = FancyBboxPatch(
        (x, y - h), w, h,
        boxstyle="round,pad=0,rounding_size=0.008",
        facecolor=fill, edgecolor=edge, linewidth=0.6, zorder=2
    )
    ax.add_patch(box)
    cy = y - 0.012
    if title:
        ax.text(x + 0.008, cy, title, fontsize=fontsize+0.5,
                fontweight="bold", color=text_color, va="center")
        cy -= 0.018
    for line in lines:
        ax.text(x + 0.008, cy, line, fontsize=fontsize,
                color=text_color, va="center")
        cy -= line_h


# ══════════════════════════════════════════════════════
#  DIAGRAM 1: Current ASTER Architecture
# ══════════════════════════════════════════════════════
def build_aster():
    fig, ax = plt.subplots(1, 1, figsize=(14, 11))
    fig.patch.set_facecolor(C["bg"])
    ax.set_facecolor(C["bg"])
    ax.set_xlim(-0.05, 1.05)
    ax.set_ylim(-0.05, 1.05)
    ax.set_aspect("equal")
    ax.axis("off")

    # Title
    ax.text(0.5, 0.99, "ASTER — Current Architecture",
            ha="center", va="top", fontsize=16, fontweight="bold",
            color=C["out_text"])
    ax.text(0.5, 0.965, "Agentic Science Toolkit for Exoplanet Research  •  Panek et al. 2026",
            ha="center", va="top", fontsize=7, color=C["fw_text"])

    # ── User ──
    draw_box(ax, 0.5, 0.92, 0.22, 0.04, C["user_fill"], C["user_edge"],
             C["user_text"], "Researcher", fontsize=9, lw=1.4,
             sublabel="Natural-language request")

    # ── Agent ──
    draw_box(ax, 0.5, 0.85, 0.26, 0.04, C["agent_fill"], C["agent_edge"],
             C["agent_text"], "LLM Agent", fontsize=9, lw=1.4,
             sublabel="GPT-4.1-mini via orchestral-ai")

    draw_arrow(ax, 0.5, 0.90, 0.5, 0.87, C["user_edge"])
    ax.text(0.515, 0.886, "prompt", fontsize=5, color=C["fw_text"])

    # ── Skill Files (left of agent) ──
    skills = ["taurex_setup.md", "retrieval_best_practices.md", "corner_plots.md"]
    sy = 0.87
    for i, sk in enumerate(skills):
        yy = sy - i * 0.028
        draw_box(ax, 0.17, yy, 0.16, 0.022, C["skill_fill"], C["skill_edge"],
                 C["skill_text"], sk, fontsize=5.5, lw=0.7, bold=False)
        ax.annotate("", xy=(0.37, 0.85), xytext=(0.25, yy),
                    arrowprops=dict(arrowstyle="-|>", color=C["skill_edge"],
                                    lw=0.5, linestyle="--", mutation_scale=6),
                    zorder=1)
    draw_label(ax, 0.09, 0.905, "Skill Files", C["skill_text"], fontsize=6)
    ax.text(0.26, 0.893, "on demand", fontsize=4.5, color=C["skill_text"],
            fontstyle="italic")

    # ── Framework Tools (right of agent) ──
    fwtools = ["RunCommandTool", "File I/O Tools", "WebSearchTool", "DisplayImageTool"]
    for i, ft in enumerate(fwtools):
        yy = 0.875 - i * 0.024
        draw_box(ax, 0.82, yy, 0.14, 0.019, C["fw_fill"], C["fw_edge"],
                 C["fw_text"], ft, fontsize=5, lw=0.5, bold=False)
    draw_label(ax, 0.75, 0.905, "Framework Tools", C["fw_text"], fontsize=6)

    # Safety hook
    draw_box(ax, 0.97, 0.875, 0.08, 0.016, "#FEF2F2", "#DC2626",
             "#DC2626", "DangerousCommandHook", fontsize=4, lw=0.5, bold=False)
    draw_arrow(ax, 0.89, 0.875, 0.93, 0.875, "#DC2626", lw=0.4)

    ax.annotate("", xy=(0.75, 0.855), xytext=(0.63, 0.85),
                arrowprops=dict(arrowstyle="-|>", color=C["fw_edge"],
                                lw=0.5, linestyle="--", mutation_scale=6))

    # ══════════════════════════════
    # TauREx Wrappers (left column)
    # ══════════════════════════════
    tx = 0.28
    tools_taurex = [
        ("SetTaurexPaths", "opacity + CIA paths"),
        ("RunTaurexModelTool", "forward model (gray cloud)"),
        ("SimulateTaurexRetrieval", "nested sampling (nestle/multinest)"),
        ("PlotCornerPosteriors", "posterior visualization"),
    ]
    ty_start = 0.755
    ty_step = 0.055
    for i, (name, sub) in enumerate(tools_taurex):
        yy = ty_start - i * ty_step
        draw_box(ax, tx, yy, 0.2, 0.035, C["tool_fill"], C["tool_edge"],
                 C["tool_text"], name, fontsize=6.5, lw=0.9,
                 sublabel=sub)

    # Group box
    gbox = FancyBboxPatch(
        (tx - 0.115, ty_start - 3*ty_step - 0.028), 0.23, 3*ty_step + 0.07,
        boxstyle="round,pad=0,rounding_size=0.01",
        facecolor=C["tool_fill"], edgecolor=C["tool_edge"],
        linewidth=0.4, alpha=0.15, zorder=0
    )
    ax.add_patch(gbox)
    draw_label(ax, tx - 0.1, ty_start + 0.03, "TauREx Wrappers", C["tool_text"])

    # Agent → tools
    draw_elbow(ax, 0.5, 0.83, 0.5, 0.79, tx, ty_start + 0.0175,
               C["agent_edge"], lw=0.8)

    # Sequential arrows
    labels_seq = ["singletons set", "spectrum generated", "posteriors saved"]
    for i in range(3):
        y1 = ty_start - i * ty_step - 0.0175
        y2 = ty_start - (i+1) * ty_step + 0.0175
        draw_arrow(ax, tx, y1, tx, y2, C["tool_edge"], lw=0.7)
        ax.text(tx + 0.11, (y1+y2)/2, labels_seq[i],
                fontsize=4.5, color=C["fw_text"])

    # ══════════════════════════════
    # Data Acquisition (right column)
    # ══════════════════════════════
    dx = 0.72
    tools_data = [
        ("GetExoplanetParameters", "TAP query → planet properties"),
        ("FindExoplanetsByCondition", "ADQL WHERE search"),
        ("DownloadDataset", "Firefly → spectrum.dat"),
    ]
    dy_start = 0.755
    dy_step = 0.055
    for i, (name, sub) in enumerate(tools_data):
        yy = dy_start - i * dy_step
        draw_box(ax, dx, yy, 0.2, 0.035, C["data_fill"], C["data_edge"],
                 C["data_text"], name, fontsize=6.5, lw=0.9,
                 sublabel=sub)

    # Group box
    gbox2 = FancyBboxPatch(
        (dx - 0.115, dy_start - 2*dy_step - 0.028), 0.23, 2*dy_step + 0.07,
        boxstyle="round,pad=0,rounding_size=0.01",
        facecolor=C["data_fill"], edgecolor=C["data_edge"],
        linewidth=0.4, alpha=0.15, zorder=0
    )
    ax.add_patch(gbox2)
    draw_label(ax, dx - 0.1, dy_start + 0.03, "Data Acquisition", C["data_text"])

    # Agent → data
    draw_elbow(ax, 0.5, 0.79, 0.5, 0.79, dx, dy_start + 0.0175,
               C["agent_edge"], lw=0.8)

    # Sequential arrows
    for i in range(2):
        y1 = dy_start - i * dy_step - 0.0175
        y2 = dy_start - (i+1) * dy_step + 0.0175
        draw_arrow(ax, dx, y1, dx, y2, C["data_edge"], lw=0.7)

    # External service
    draw_box(ax, 0.97, 0.755, 0.12, 0.03, C["ext_fill"], C["ext_edge"],
             C["fw_text"], "NASA Exoplanet", fontsize=5.5, lw=0.5, bold=False,
             sublabel="Archive (TAP)")
    draw_arrow(ax, 0.82, 0.755, 0.91, 0.755, C["data_edge"], lw=0.5, style="--")
    ax.text(0.86, 0.763, "HTTP", fontsize=4, color=C["fw_text"])

    # ══════════════════════════════
    # TauREx Engine
    # ══════════════════════════════
    ey = 0.42
    draw_box(ax, 0.42, ey, 0.38, 0.05, C["out_fill"], C["out_edge"],
             C["out_text"], "TauREx 3 Engine", fontsize=9, lw=1.0,
             sublabel="Isothermal T-P • H₂/He • Absorption + Rayleigh + CIA")

    # Tools → engine
    draw_arrow(ax, tx, ty_start - 2*ty_step - 0.0175, tx, ey + 0.025,
               C["out_edge"], lw=0.7)
    ax.text(tx + 0.01, 0.50, "builds & fits", fontsize=4.5, color=C["fw_text"])

    # Opacity data
    draw_box(ax, 0.08, ey, 0.14, 0.035, C["out_fill"], C["out_edge"],
             C["out_text"], "Opacity Data", fontsize=6, lw=0.7,
             sublabel="xsec/ (ExoMol) + cia/ (HITRAN)")
    draw_arrow(ax, 0.15, ey, 0.23, ey, C["out_edge"], lw=0.6)
    ax.text(0.155, ey + 0.012, "H₂O, CO₂, CH₄, CO, NH₃",
            fontsize=4, color=C["fw_text"])

    draw_box(ax, 0.08, ey - 0.045, 0.1, 0.025, C["out_fill"], C["out_edge"],
             C["out_text"], "download_linelists.py", fontsize=4.5, lw=0.5, bold=False,
             sublabel="one-time setup")
    draw_arrow(ax, 0.08, ey - 0.032, 0.08, ey - 0.017, C["fw_edge"], lw=0.4)

    # Data → retrieval
    draw_elbow(ax, dx, dy_start - 2*dy_step - 0.0175, dx, 0.55,
               tx + 0.1, ty_start - 2*ty_step, C["data_edge"], lw=0.6)
    ax.text(dx + 0.01, 0.57, "spectrum.dat", fontsize=4.5, color=C["fw_text"])

    # ══════════════════════════════
    # Outputs
    # ══════════════════════════════
    oy = 0.30
    outputs = [
        (0.22, "Synthetic Spectrum", ".npy + .png (~100k pts)"),
        (0.42, "Fit Plot", "data vs. best-fit model"),
        (0.58, "Retrieval Posteriors", ".npy samples + weights"),
        (0.72, "Corner Plot", "parameter correlations"),
    ]
    for ox, name, sub in outputs:
        draw_box(ax, ox, oy, 0.16, 0.03, C["out_fill"], C["out_edge"],
                 C["out_text"], name, fontsize=6, lw=0.6, bold=False,
                 sublabel=sub)

    # Engine → outputs
    for ox in [0.22, 0.42, 0.58, 0.72]:
        draw_arrow(ax, 0.42, ey - 0.025, ox, oy + 0.015, C["out_edge"], lw=0.5)

    # Group label
    gbox3 = FancyBboxPatch(
        (0.12, oy - 0.025), 0.68, 0.06,
        boxstyle="round,pad=0,rounding_size=0.008",
        facecolor=C["out_fill"], edgecolor=C["out_edge"],
        linewidth=0.3, alpha=0.1, zorder=0
    )
    ax.add_patch(gbox3)
    draw_label(ax, 0.14, oy + 0.04, "Outputs (per planet)", C["out_text"])

    # Sandbox
    ax.text(0.5, 0.255, "All I/O scoped to workspace/ via StateField(base_directory)",
            ha="center", fontsize=5, fontstyle="italic", color=C["fw_text"])

    # ══════════════════════════════
    # Limitations
    # ══════════════════════════════
    draw_annotation(ax, 0.72, 0.22, 0.27,
        ["• Single-planet only — no batch",
         "• Gray cloud (no microphysics)",
         "• NASA Archive only (no MAST/JWST)",
         "• No Ariel noise model",
         "• No population inference",
         "• No cloud proxy computation"],
        "#DC2626", "#FEF2F2", "#991B1B",
        title="Key Limitations")

    fig.savefig("aster_current_architecture.pdf", dpi=300,
                bbox_inches="tight", facecolor=fig.get_facecolor())
    fig.savefig("aster_current_architecture.png", dpi=300,
                bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)
    print("OK: aster_current_architecture.pdf + .png")


# ══════════════════════════════════════════════════════
#  DIAGRAM 2: MAIEA Proposed Architecture
# ══════════════════════════════════════════════════════
def build_maiea():
    fig, ax = plt.subplots(1, 1, figsize=(16, 18))
    fig.patch.set_facecolor(C["bg"])
    ax.set_facecolor(C["bg"])
    ax.set_xlim(-0.05, 1.05)
    ax.set_ylim(-0.05, 1.05)
    ax.set_aspect("equal")
    ax.axis("off")

    # Title
    ax.text(0.5, 0.99, "MAIEA — Proposed Architecture",
            ha="center", va="top", fontsize=16, fontweight="bold",
            color=C["out_text"])
    ax.text(0.5, 0.975, "Multi-wavelength Agentic Inference for Exoplanet Atmospheres  •  Naqvi & Cowan",
            ha="center", va="top", fontsize=7, color=C["fw_text"])

    # Legend
    legend_items = [
        (0.22, "#059669", "New MAIEA component"),
        (0.42, C["tool_edge"], "Kept from ASTER"),
        (0.6, C["cloud_edge"], "Virga cloud physics"),
        (0.78, C["hermes_edge"], "HERMES (separate)")
    ]
    for lx, col, lab in legend_items:
        rect = FancyBboxPatch(
            (lx - 0.015, 0.957), 0.03, 0.01,
            boxstyle="round,pad=0,rounding_size=0.003",
            facecolor=col, edgecolor=col, linewidth=0.5, alpha=0.3
        )
        ax.add_patch(rect)
        ax.plot([lx-0.015, lx+0.015], [0.962, 0.962], color=col, lw=1.5)
        ax.text(lx + 0.02, 0.962, lab, fontsize=5.5, color=col,
                va="center", fontweight="bold")

    # ── User ──
    draw_box(ax, 0.5, 0.935, 0.18, 0.03, C["user_fill"], C["user_edge"],
             C["user_text"], "Researcher", fontsize=9, lw=1.4)

    # ── Agent ──
    draw_box(ax, 0.5, 0.895, 0.26, 0.03, C["agent_fill"], C["agent_edge"],
             C["agent_text"], "MAIEA Agent", fontsize=9, lw=1.4,
             sublabel="Cloud-aware agentic pipeline via orchestral-ai")
    draw_arrow(ax, 0.5, 0.92, 0.5, 0.91, C["user_edge"])

    # ══════════════════════════════
    # COL 1: DATA ACQUISITION
    # ══════════════════════════════
    c1x = 0.13
    step = 0.038
    dy = 0.815
    data_tools = [
        ("GetExoplanetParameters", "TAP query (kept)", False),
        ("FindExoplanetsByCondition", "ADQL search (kept)", False),
        ("DownloadDataset", "Firefly spectra (kept)", False),
        ("DownloadJWSTSpectraTool", "MAST → spectrum.dat", True),
        ("LoadArielMCSTool", "MCS catalog → 537 planets", True),
    ]
    for i, (name, sub, is_new) in enumerate(data_tools):
        yy = dy - i * step
        if is_new:
            draw_box(ax, c1x, yy, 0.18, 0.028, C["new_fill"], C["new_edge"],
                     C["new_text"], name, fontsize=5.5, lw=1.0,
                     sublabel=sub, badge="NEW")
        else:
            draw_box(ax, c1x, yy, 0.18, 0.028, C["data_fill"], C["data_edge"],
                     C["data_text"], name, fontsize=5.5, lw=0.8,
                     sublabel=sub)

    # Group box
    gbox = FancyBboxPatch(
        (c1x - 0.1, dy - 4*step - 0.02), 0.2, 4*step + 0.055,
        boxstyle="round,pad=0,rounding_size=0.008",
        facecolor=C["data_fill"], edgecolor=C["data_edge"],
        linewidth=0.35, alpha=0.12, zorder=0
    )
    ax.add_patch(gbox)
    draw_label(ax, c1x - 0.085, dy + 0.025, "data/", C["data_text"])

    # Agent → data
    draw_elbow(ax, 0.5, 0.88, 0.5, 0.845, c1x, dy + 0.014,
               C["agent_edge"], lw=0.7)

    # External services
    draw_box(ax, c1x + 0.2, dy, 0.1, 0.022, C["ext_fill"], C["ext_edge"],
             C["fw_text"], "NASA Archive", fontsize=5, lw=0.4, bold=False,
             sublabel="TAP Service")
    draw_arrow(ax, c1x + 0.09, dy, c1x + 0.15, dy, C["data_edge"], lw=0.4, style="--")

    draw_box(ax, c1x + 0.2, dy - 3*step, 0.1, 0.022, C["new_fill"],
             C["new_edge"], C["new_text"], "MAST / Exo.MAST", fontsize=5,
             lw=0.4, bold=False, sublabel="astroquery.mast", badge="NEW")
    draw_arrow(ax, c1x + 0.09, dy - 3*step, c1x + 0.15, dy - 3*step,
               C["new_edge"], lw=0.4, style="--")

    # ══════════════════════════════
    # COL 2: FORWARD MODELING
    # ══════════════════════════════
    c2x = 0.39
    fy = 0.815
    fwd_tools = [
        ("SetTaurexPaths", "opacity config (kept)", "kept"),
        ("RunTaurexModelTool", "forward model (extended)", "kept"),
        ("RunVirgaTool", "Teq, g, fsed, Z → κ_cloud(λ,P)", "cloud"),
        ("RunTaurexCloudTool", "Virga → TauREx Mie coupling", "cloud"),
    ]
    for i, (name, sub, style) in enumerate(fwd_tools):
        yy = fy - i * step
        if style == "cloud":
            draw_box(ax, c2x, yy, 0.18, 0.028, C["cloud_fill"], C["cloud_edge"],
                     C["cloud_text"], name, fontsize=5.5, lw=1.0,
                     sublabel=sub, badge="NEW")
        else:
            draw_box(ax, c2x, yy, 0.18, 0.028, C["tool_fill"], C["tool_edge"],
                     C["tool_text"], name, fontsize=5.5, lw=0.8,
                     sublabel=sub)

    # Group box
    gbox2 = FancyBboxPatch(
        (c2x - 0.1, fy - 3*step - 0.02), 0.2, 3*step + 0.055,
        boxstyle="round,pad=0,rounding_size=0.008",
        facecolor=C["cloud_fill"], edgecolor=C["cloud_edge"],
        linewidth=0.35, alpha=0.1, zorder=0
    )
    ax.add_patch(gbox2)
    draw_label(ax, c2x - 0.085, fy + 0.025, "forward/", C["cloud_text"])

    draw_elbow(ax, 0.5, 0.845, 0.5, 0.845, c2x, fy + 0.014,
               C["agent_edge"], lw=0.7)

    # Internal arrows
    draw_arrow(ax, c2x, fy - 0.014, c2x, fy - step + 0.014,
               C["tool_edge"], lw=0.6)
    # Virga → CloudModel
    draw_arrow(ax, c2x, fy - 2*step - 0.014, c2x, fy - 3*step + 0.014,
               C["cloud_edge"], lw=0.7)
    ax.text(c2x + 0.1, fy - 2.5*step, "κ_cloud", fontsize=4.5, color=C["fw_text"])
    # CloudModel → FwdModel (upward injection)
    ax.annotate("", xy=(c2x - 0.03, fy - step - 0.014),
                xytext=(c2x - 0.03, fy - 3*step + 0.014),
                arrowprops=dict(arrowstyle="-|>", color=C["cloud_edge"],
                                lw=0.7, mutation_scale=7))
    ax.text(c2x - 0.075, fy - 2*step, "opacity\ninjected", fontsize=4,
            color=C["cloud_text"], ha="center", va="center")

    # ══════════════════════════════
    # COL 3: GRID + NOISE + PROXY
    # ══════════════════════════════
    c3x = 0.63
    gy = 0.815
    col3_tools = [
        ("RunForwardModelGridTool", "500 planets × fsed → HDF5", "grid"),
        ("AddArielNoiseTool", "ExoRad → Tier-2 noise", "noise"),
        ("ComputeCloudProxyTool", "depth(1.4μm) / depth(3.5μm)", "proxy"),
        ("FitCloudProxyGridTool", "proxy vs (fsed, Teq, Z)", "proxy"),
    ]
    styles_map = {
        "grid": (C["grid_fill"], C["grid_edge"], C["grid_text"]),
        "noise": (C["noise_fill"], C["noise_edge"], C["noise_text"]),
        "proxy": (C["proxy_fill"], C["proxy_edge"], C["proxy_text"]),
    }
    for i, (name, sub, sty) in enumerate(col3_tools):
        yy = gy - i * step
        f, e, t = styles_map[sty]
        draw_box(ax, c3x, yy, 0.18, 0.028, f, e, t, name,
                 fontsize=5.5, lw=1.0, sublabel=sub, badge="NEW")

    # Group boxes for each category
    for idx, (label, col, rows) in enumerate([
        ("forward/grid.py", C["grid_edge"], (0, 0)),
        ("noise/", C["noise_edge"], (1, 1)),
        ("analysis/", C["proxy_edge"], (2, 3)),
    ]):
        r0, r1 = rows
        gb = FancyBboxPatch(
            (c3x - 0.1, gy - r1*step - 0.02), 0.2,
            (r1 - r0)*step + 0.055,
            boxstyle="round,pad=0,rounding_size=0.008",
            facecolor=styles_map[["grid","noise","proxy"][idx]][0],
            edgecolor=styles_map[["grid","noise","proxy"][idx]][1],
            linewidth=0.3, alpha=0.1, zorder=0
        )
        ax.add_patch(gb)
        draw_label(ax, c3x - 0.085, gy - r0*step + 0.025, label,
                   styles_map[["grid","noise","proxy"][idx]][2])

    draw_elbow(ax, 0.5, 0.845, 0.5, 0.845, c3x, gy + 0.014,
               C["agent_edge"], lw=0.7)

    # Sequential arrows in col 3
    arrow_cols = [C["grid_edge"], C["noise_edge"], C["proxy_edge"]]
    labels_c3 = ["clean spectra", "noised spectra", ""]
    for i in range(3):
        y1 = gy - i*step - 0.014
        y2 = gy - (i+1)*step + 0.014
        draw_arrow(ax, c3x, y1, c3x, y2, arrow_cols[i], lw=0.6)
        if labels_c3[i]:
            ax.text(c3x + 0.1, (y1+y2)/2, labels_c3[i],
                    fontsize=4, color=C["fw_text"])

    # Cross: forward → grid
    ax.plot([c2x + 0.09, c3x - 0.09], [fy - 3*step, gy],
            color=C["cloud_edge"], lw=0.6, linestyle="-", zorder=1)
    draw_arrow(ax, c3x - 0.12, gy + 0.003, c3x - 0.09, gy,
               C["cloud_edge"], lw=0.6)
    ax.text((c2x + c3x)/2, fy - 2.2*step, "cloud-aware\nspectra",
            fontsize=4, color=C["cloud_text"], ha="center")

    # DRAC
    draw_box(ax, c3x + 0.2, gy, 0.09, 0.022, C["grid_fill"], C["grid_edge"],
             C["grid_text"], "DRAC HPC", fontsize=5, lw=0.4, bold=False,
             sublabel="joblib parallel")
    draw_arrow(ax, c3x + 0.09, gy, c3x + 0.155, gy, C["grid_edge"],
               lw=0.4, style="--")

    # ══════════════════════════════
    # COL 4: RETRIEVAL
    # ══════════════════════════════
    c4x = 0.88
    ry = 0.815
    ret_tools = [
        ("SimulateTaurexRetrieval", "+ fsed free param (extended)", False),
        ("PlotCornerPosteriors", "posterior plots (kept)", False),
        ("RunSubNeptuneRetrievalTool", "sub-Neptune priors", True),
    ]
    for i, (name, sub, is_new) in enumerate(ret_tools):
        yy = ry - i * step
        if is_new:
            draw_box(ax, c4x, yy, 0.18, 0.028, C["new_fill"], C["new_edge"],
                     C["new_text"], name, fontsize=5.5, lw=1.0,
                     sublabel=sub, badge="NEW")
        else:
            draw_box(ax, c4x, yy, 0.18, 0.028, C["tool_fill"], C["tool_edge"],
                     C["tool_text"], name, fontsize=5.5, lw=0.8,
                     sublabel=sub)

    gbox4 = FancyBboxPatch(
        (c4x - 0.1, ry - 2*step - 0.02), 0.2, 2*step + 0.055,
        boxstyle="round,pad=0,rounding_size=0.008",
        facecolor=C["tool_fill"], edgecolor=C["tool_edge"],
        linewidth=0.35, alpha=0.12, zorder=0
    )
    ax.add_patch(gbox4)
    draw_label(ax, c4x - 0.085, ry + 0.025, "retrieval/", C["tool_text"])

    draw_elbow(ax, 0.5, 0.845, 0.5, 0.845, c4x, ry + 0.014,
               C["agent_edge"], lw=0.7)

    # Retrieval internal
    for i in range(2):
        draw_arrow(ax, c4x, ry - i*step - 0.014, c4x,
                   ry - (i+1)*step + 0.014, C["tool_edge"], lw=0.6)

    # Data → retrieval (spectrum.dat)
    ax.plot([c1x, c1x, c4x - 0.09], [dy - 4*step - 0.014, 0.62, 0.62],
            color=C["data_edge"], lw=0.5, zorder=1)
    draw_arrow(ax, c4x - 0.09, 0.62, c4x - 0.09, ry - 2*step - 0.014,
               C["data_edge"], lw=0.5)
    ax.text(c1x + 0.01, 0.63, "spectrum.dat", fontsize=4, color=C["fw_text"])

    # ══════════════════════════════
    # MAIEA BOUNDARY
    # ══════════════════════════════
    boundary = FancyBboxPatch(
        (0.01, 0.565), 0.98, 0.36,
        boxstyle="round,pad=0,rounding_size=0.012",
        facecolor="none", edgecolor=C["agent_edge"],
        linewidth=1.0, linestyle="--", alpha=0.2, zorder=0
    )
    ax.add_patch(boundary)
    ax.text(0.97, 0.93, "MAIEA Boundary", ha="right", fontsize=6,
            fontweight="bold", color=C["agent_edge"], alpha=0.5)

    # ══════════════════════════════
    # TauREx + Virga ENGINE
    # ══════════════════════════════
    ey = 0.535
    draw_box(ax, 0.5, ey, 0.5, 0.04, C["out_fill"], C["out_edge"],
             C["out_text"], "TauREx 3 + Virga Cloud Microphysics", fontsize=9,
             lw=1.0,
             sublabel="Mie scattering replaces gray slab • taurex_petitrad coupling • 3 chemistry modes")

    # Forward → engine
    draw_arrow(ax, c2x, fy - 3*step - 0.014, c2x, ey + 0.02,
               C["out_edge"], lw=0.7)
    # Retrieval → engine
    draw_arrow(ax, c4x, ry - 2*step - 0.014, c4x, ey + 0.02,
               C["out_edge"], lw=0.7)

    # ══════════════════════════════
    # MAIEA OUTPUTS
    # ══════════════════════════════
    oy = 0.47
    draw_box(ax, 0.32, oy, 0.2, 0.03, C["out_fill"], C["out_edge"],
             C["out_text"], "Per-planet Posteriors", fontsize=6.5, lw=0.7,
             sublabel="Zi, fsed,i, Ti — median + 68% CI")
    draw_box(ax, 0.68, oy, 0.2, 0.03, C["out_fill"], C["out_edge"],
             C["out_text"], "Cloud Proxy Grid", fontsize=6.5, lw=0.7,
             sublabel="degeneracy map in (fsed, Teq, Z)")
    draw_arrow(ax, 0.5, ey - 0.02, 0.32, oy + 0.015, C["out_edge"], lw=0.6)
    draw_arrow(ax, 0.5, ey - 0.02, 0.68, oy + 0.015, C["out_edge"], lw=0.6)

    # ══════════════════════════════
    # CSV BRIDGE
    # ══════════════════════════════
    by = 0.41
    draw_box(ax, 0.5, by, 0.32, 0.03, C["hermes_fill"], C["hermes_edge"],
             C["hermes_text"], "CSV Bridge", fontsize=7, lw=0.9,
             sublabel="logM, log(X_H2O), σ⁻, σ⁺, fsed — format HERMES expects")
    draw_arrow(ax, 0.32, oy - 0.015, 0.42, by + 0.015, C["hermes_edge"], lw=0.9)
    draw_arrow(ax, 0.68, oy - 0.015, 0.58, by + 0.015, C["hermes_edge"],
               lw=0.6, style="--")

    # ══════════════════════════════
    # HERMES
    # ══════════════════════════════
    hy = 0.34
    draw_box(ax, 0.5, hy, 0.32, 0.04, C["hermes_fill"], C["hermes_edge"],
             C["hermes_text"], "HERMES", fontsize=10, lw=1.6,
             sublabel="Population HBM — numpyro + JAX (NUTS)")
    ax.text(0.5, hy - 0.022, "α, β (mass-metallicity) • σ_true • T_transition • γ",
            ha="center", fontsize=5, color=C["hermes_text"])
    draw_arrow(ax, 0.5, by - 0.015, 0.5, hy + 0.02, C["hermes_edge"], lw=1.2)
    ax.text(0.52, (by + hy)/2, "ingests", fontsize=5, color=C["hermes_text"],
            fontweight="bold")

    # HERMES outputs
    hoy = 0.275
    draw_box(ax, 0.35, hoy, 0.18, 0.028, C["out_fill"], C["hermes_edge"],
             C["hermes_text"], "Population Posteriors", fontsize=6, lw=0.7,
             sublabel="mass-metallicity trend")
    draw_box(ax, 0.65, hoy, 0.18, 0.028, C["out_fill"], C["hermes_edge"],
             C["hermes_text"], "Cloud Population", fontsize=6, lw=0.7,
             sublabel="fsed transition in Teq–Rp")
    draw_arrow(ax, 0.5, hy - 0.02, 0.35, hoy + 0.014, C["hermes_edge"], lw=0.7)
    draw_arrow(ax, 0.5, hy - 0.02, 0.65, hoy + 0.014, C["hermes_edge"], lw=0.7)

    # Separate system annotation
    ax.text(0.5, 0.245, "HERMES = separate system (Paper 1) — untouched by MAIEA",
            ha="center", fontsize=5.5, fontstyle="italic", color=C["hermes_text"])
    ax.plot([0.22, 0.78], [0.255, 0.255], color=C["hermes_edge"],
            lw=0.4, linestyle="--", alpha=0.3)

    # ══════════════════════════════
    # SCALE + DEPS annotations
    # ══════════════════════════════
    draw_annotation(ax, 0.77, 0.22, 0.22,
        ["~500 planets × 5 fsed × 5 Z",
         "= ~12,500 forward models",
         "",
         "Process parallelism only",
         "(TauREx not thread-safe)",
         "",
         "HDF5/zarr storage",
         "Cache by (Teq, g, Z, fsed)"],
        C["grid_edge"], C["grid_fill"], C["grid_text"],
        title="Population Scale")

    draw_annotation(ax, 0.77, 0.06, 0.22,
        ["virga — microphysics",
         "astroquery — MAST access",
         "exorad — ArielRad noise",
         "h5py — HDF5 grid storage",
         "joblib — process parallelism",
         "scipy — proxy fitting"],
        C["new_edge"], C["new_fill"], C["new_text"],
        title="New Dependencies")

    fig.savefig("maiea_proposed_architecture.pdf", dpi=300,
                bbox_inches="tight", facecolor=fig.get_facecolor())
    fig.savefig("maiea_proposed_architecture.png", dpi=300,
                bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)
    print("OK: maiea_proposed_architecture.pdf + .png")


if __name__ == "__main__":
    build_aster()
    build_maiea()
