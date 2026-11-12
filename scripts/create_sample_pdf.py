from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen.canvas import Canvas


OUTPUT = Path(__file__).resolve().parents[1] / "demo" / "sample-registration.pdf"


def draw_field(canvas: Canvas, label: str, value: str, y: float) -> float:
    canvas.setFillColor(HexColor("#4F5960"))
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(58, y, f"{label}:")
    canvas.setFillColor(HexColor("#171A1C"))
    canvas.setFont("Helvetica", 10)
    canvas.drawString(168, y, value)
    canvas.setStrokeColor(HexColor("#D3D0C8"))
    canvas.line(58, y - 8, 537, y - 8)
    return y - 38


def create_pdf() -> None:
    canvas = Canvas(str(OUTPUT), pagesize=A4)
    width, height = A4

    canvas.setFillColor(HexColor("#1F282C"))
    canvas.rect(0, height - 120, width, 120, fill=1, stroke=0)
    canvas.setFillColor(HexColor("#D48B39"))
    canvas.rect(0, height - 120, 9, 120, fill=1, stroke=0)
    canvas.setFillColor(HexColor("#FFFFFF"))
    canvas.setFont("Helvetica-Bold", 20)
    canvas.drawString(58, height - 64, "Employee registration record")
    canvas.setFillColor(HexColor("#C7CED0"))
    canvas.setFont("Helvetica", 9)
    canvas.drawString(58, height - 84, "Fictional document created for the public demonstration")

    fields = [
        ("Employee", "Marina Souza"),
        ("CPF", "123.456.789-09"),
        ("Birth date", "14/03/1994"),
        ("Address", "Rua das Flores, 120, Apt 31, Vila Nova, Santos, SP, 11000-000"),
        ("Admission date", "05/10/2026"),
        ("Department", "Store operations"),
        ("Job title", "Sales assistant"),
        ("Salary", "R$ 2,350.00"),
    ]

    y = height - 168
    for label, value in fields:
        y = draw_field(canvas, label, value, y)

    canvas.setFillColor(HexColor("#6A7378"))
    canvas.setFont("Helvetica", 8)
    canvas.drawString(58, 56, "This file contains fictional information and is intended only for local testing.")
    canvas.setTitle("Fictional employee registration record")
    canvas.save()


if __name__ == "__main__":
    create_pdf()
