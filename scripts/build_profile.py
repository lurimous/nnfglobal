#!/usr/bin/env python3
"""Build the NNF Global company profile PDF (branded, navy + gold)."""
from fpdf import FPDF

NAVY   = (12, 26, 46)
NAVY2  = (20, 42, 69)
GOLD   = (200, 148, 31)
GOLDD  = (167, 123, 22)
GOLDS  = (236, 203, 122)
LIGHT  = (246, 248, 251)
TEXT   = (38, 46, 58)
MUTED  = (96, 106, 120)
WHITE  = (255, 255, 255)

F = "C:/Windows/Fonts/"
LOGO = "assets/images/logo-transparent.png"

class Profile(FPDF):
    def header(self): pass
    def footer(self): pass

pdf = Profile(orientation="P", unit="mm", format="A4")
pdf.set_auto_page_break(False)
pdf.add_font("Serif", "", F + "georgia.ttf")
pdf.add_font("Serif", "B", F + "georgiab.ttf")
pdf.add_font("Sans", "", F + "arial.ttf")
pdf.add_font("Sans", "B", F + "arialbd.ttf")
pdf.add_font("Sans", "I", F + "ariali.ttf")

PW, PH, M = 210, 297, 18

def rect(x, y, w, h, color):
    pdf.set_fill_color(*color); pdf.rect(x, y, w, h, "F")

def text(x, y, s, font, style, size, color, align="L", w=0):
    pdf.set_xy(x, y); pdf.set_font(font, style, size); pdf.set_text_color(*color)
    pdf.cell(w if w else PW - 2 * M, 6, s, align=align)

def para(x, y, w, s, size=10.5, color=TEXT, lh=5.2, font="Sans", style=""):
    pdf.set_xy(x, y); pdf.set_font(font, style, size); pdf.set_text_color(*color)
    pdf.multi_cell(w, lh, s)
    return pdf.get_y()

# ---------------- Cover ----------------
pdf.add_page()
rect(0, 0, PW, PH, NAVY)
rect(0, 150, PW, 1.0, GOLDD)
pdf.image(LOGO, x=(PW - 38) / 2, y=40, w=38)
text(0, 92, "NNF GLOBAL", "Serif", "B", 40, GOLDS, "C", PW)
pdf.set_draw_color(*GOLD); pdf.set_line_width(0.5); pdf.line(PW/2 - 30, 128, PW/2 + 30, 128)
text(0, 132, "C O M P A N Y   P R O F I L E", "Sans", "B", 12, LIGHT, "C", PW)
text(0, 160, "Project Consultancy & Venture Builder", "Sans", "I", 12, GOLDS, "C", PW)
text(0, 170, "Building Malaysia's people-first ventures.", "Serif", "", 13, LIGHT, "C", PW)
text(0, 250, "SSM Reg. No. 202603031145 (TR0336679-K)", "Sans", "", 9.5, (170, 182, 198), "C", PW)
text(0, 257, "Semenyih, Selangor, Malaysia  ·  nnfglobal.online", "Sans", "", 9.5, (170, 182, 198), "C", PW)

# ---------------- Section page helper ----------------
def section_page(label):
    pdf.add_page()
    rect(0, 0, PW, PH, WHITE)
    rect(0, 0, PW, 30, NAVY)
    rect(0, 30, PW, 1.0, GOLDD)
    text(M, 9, "NNF GLOBAL", "Serif", "B", 15, GOLDS, "L")
    pdf.set_xy(0, 17); pdf.set_font("Sans", "B", 9); pdf.set_text_color(*GOLDS)
    pdf.cell(PW - M, 5, label.upper(), align="R")
    return 42

def heading(x, y, s, size=15):
    pdf.set_draw_color(*GOLD); pdf.set_line_width(1.2)
    pdf.line(x, y + 1.5, x, y + 7.5)
    text(x + 4, y, s, "Serif", "B", size, NAVY, "L")
    return y + 11

def pagenum(n):
    text(0, PH - 12, f"{n}", "Sans", "", 9, MUTED, "C", PW)
    text(M, PH - 12, "NNF Global — Company Profile", "Sans", "", 8.5, MUTED, "L")

# ---------------- Page 2: About + What we do ----------------
y = section_page("About")
y = heading(M, y, "Who we are")
y = para(M, y + 1, PW - 2*M,
    "NNF Global is a Malaysian project consultancy and venture builder based in Semenyih, "
    "Selangor. We originate, structure, finance, and promote ventures that combine commercial "
    "strength with tangible public benefit — turning public-good ideas into self-sustaining, "
    "scalable businesses.\n\n"
    "As parent and exclusive promoter, NNF Global currently stewards two flagship ventures: "
    "Hentian Bas Mesra Rakyat and Saté Ria.")
y = heading(M, y + 6, "What we do")
items = [
 ("Project Consultancy", "Advisory, structuring, financing and management of complex projects, "
  "including public infrastructure delivered through Private Finance Initiative (PFI) models."),
 ("Events & Promotions", "Organisation, promotion and management of events and sporting "
  "programmes, both indoor and outdoor, for professional and public audiences."),
 ("Food & Beverage Ventures", "From central-kitchen manufacturing to fast-food restaurants, "
  "kiosks and mobile formats — building and promoting scalable F&B brands."),
 ("Online Retail & Wholesale", "Retail sale of products over the internet and wholesale of "
  "foodstuffs at scale."),
]
y += 2
for t, d in items:
    pdf.set_fill_color(*GOLD); pdf.ellipse(M + 0.5, y + 1.4, 1.8, 1.8, "F")
    text(M + 5, y, t, "Sans", "B", 11, NAVY, "L")
    y = para(M + 5, y + 5.2, PW - 2*M - 5, d, size=10, color=MUTED, lh=4.8)
    y += 4
pagenum(2)

# ---------------- Page 3: Ventures ----------------
y = section_page("Our Ventures")
y = heading(M, y, "Two ventures, one standard of delivery")
y += 2
def venture(y, img, title, tag, body):
    iw, ih = 55, 36
    try: pdf.image(img, x=M, y=y, w=iw, h=ih)
    except Exception: rect(M, y, iw, ih, NAVY2)
    tx = M + iw + 7
    text(tx, y, title, "Serif", "B", 14, NAVY, "L")
    pdf.set_xy(tx, y + 7); pdf.set_font("Sans", "B", 8.5); pdf.set_text_color(*GOLDD)
    pdf.cell(40, 5, tag.upper())
    para(tx, y + 13, PW - M - tx, body, size=10, color=MUTED, lh=4.8)
    return y + ih + 9
y = venture(y, "assets/images/hentianbas-hero.jpg", "Hentian Bas Mesra Rakyat", "Infrastructure · PFI",
    "A nationwide initiative transforming ordinary bus stops into world-class, people-friendly "
    "smart community hubs through a Private Finance Initiative: air-conditioned waiting halls, "
    "CCTV and security, retail and F&B, surau and clean toilets, digital billboards and telco "
    "infrastructure — self-funding, with no cost to government.")
y = venture(y, "assets/images/venture-sateria.jpg", "Saté Ria", "F&B Brand · Revival 2025–2028",
    "Malaysia's iconic satay brand, reborn. Built on a central-kitchen model for consistent "
    "quality, a versatile licensing format (food truck, kiosk, full outlet), and a global "
    "identity. Visit sateria.my.")
pagenum(3)

# ---------------- Page 4: Flagship concession ----------------
y = section_page("Flagship Project")
y = heading(M, y, "Hentian Bas Mesra Rakyat — Concession")
y = para(M, y + 1, PW - 2*M,
    "A nationwide initiative that turns ordinary bus stops into commercial, social and digital "
    "smart community hubs through a Private Finance Initiative — self-funding, at no cost to "
    "government. Aligned with the national bus transformation (BET & BRT), Smart City and ESG agendas.",
    size=10, color=MUTED, lh=4.8)
y += 3
stats = [("4,000+", "sites nationwide"), ("1.7–3.5 yrs", "payback (ROI)"),
         ("RM 10.8–22.8k", "net profit / month"), ("+10–20%", "digital · telco · green")]
bw = (PW - 2*M - 3*4) / 4
for i, (num, lab) in enumerate(stats):
    bx = M + i * (bw + 4)
    rect(bx, y, bw, 22, NAVY)
    text(bx, y + 4.5, num, "Serif", "B", 12, GOLDS, "C", bw)
    text(bx, y + 13, lab, "Sans", "", 8, LIGHT, "C", bw)
y += 30
y = heading(M, y, "Concession model", 13)
y += 1
for pct, who, desc in [
    ("40%", "Owner + PBT", "Site, approvals & “Mesra Rakyat” policy support."),
    ("10%", "Dawsix Consultancy", "Submission, legal, tenant management & maintenance."),
    ("50%", "SME Concessionaire", "Operations, rental, advertising & telco infrastructure."),
]:
    text(M, y, pct, "Serif", "B", 12, GOLDD, "L", 16)
    text(M + 17, y, who, "Sans", "B", 10.5, NAVY, "L", 60)
    para(M + 17, y + 5, PW - M - (M + 17), desc, size=9.5, color=MUTED, lh=4.4)
    y += 11
y = heading(M, y + 2, "Revenue streams", 13)
y = para(M, y + 1, PW - 2*M,
    "Rental kiosk & café 35%   ·   Advertising LED 30%   ·   Telco & WiFi 20%   ·   "
    "Community services 15%  —  gross RM 13,000–17,000 / month / location.",
    size=10, color=TEXT, lh=5)
y = heading(M, y + 3, "Rollout", 13)
y = para(M, y + 1, PW - 2*M,
    "Phase 1 Pilot — 10 sites (Selangor & KL)   ·   Phase 2 Scaling — 50 sites   ·   "
    "Phase 3 National — 200 sites, targeting RM 240 million / year.",
    size=10, color=TEXT, lh=5)
text(M, y + 4, "Full concession investor deck available on request.", "Sans", "I", 9.5, MUTED, "L", PW)
pagenum(4)

# ---------------- Page 5: Leadership + Registration + Contact ----------------
y = section_page("Leadership & Company")
y = heading(M, y, "Leadership & team")
y += 2
people = [
 ("YM Ungku Fadli Ungku Jalil", "Chairman"),
 ("Dato' Seri Farid Ibrahim", "Advisor"),
 ("Nadia Nabila", "Principal"),
 ("Nuqman", "Project Manager"),
 ("Salman", "Marketing"),
]
for n, r in people:
    pdf.set_fill_color(*GOLD); pdf.ellipse(M + 0.5, y + 1.4, 1.8, 1.8, "F")
    text(M + 5, y, n, "Sans", "B", 10.5, NAVY, "L", 90)
    text(M + 95, y, r, "Sans", "", 10.5, GOLDD, "L", 70)
    y += 6.6
y = heading(M, y + 4, "Registration")
y += 2
reg = [
 ("Business name", "NNF Global"),
 ("Registration No.", "202603031145 (TR0336679-K)"),
 ("Business form", "Sole proprietorship"),
 ("Commenced", "26 January 2026 (5-year term)"),
 ("Registered office", "Semenyih, Selangor, Malaysia"),
]
for k, v in reg:
    text(M, y, k, "Sans", "", 10, MUTED, "L", 55)
    text(M + 55, y, v, "Sans", "B", 10, NAVY, "L", 110)
    y += 6
# Contact band
by = y + 6
rect(M, by, PW - 2*M, 30, NAVY)
text(M + 8, by + 5, "Get in touch", "Serif", "B", 13, GOLDS, "L")
text(M + 8, by + 13, "admin@nnfglobal.online      nnfglobal.online      +60 11-1167 7236",
     "Sans", "", 10.5, LIGHT, "L", PW)
text(M + 8, by + 20, "Parent & exclusive promoter of Hentian Bas Mesra Rakyat & Saté Ria",
     "Sans", "I", 9.5, (180, 192, 208), "L", PW)
pagenum(5)

out = "assets/NNF-Global-Company-Profile.pdf"
pdf.output(out)
import os
print("saved", out, os.path.getsize(out)//1024, "KB,", pdf.pages_count, "pages")
