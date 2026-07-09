import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from os import getenv


SMTP_SERVER = getenv("SMTP_SERVER")
SMTP_PORT = int(getenv("SMTP_PORT"))

SMTP_EMAIL = getenv("SMTP_EMAIL")
SMTP_PASSWORD = getenv("SMTP_PASSWORD")


def enviar_correo(destinatario, asunto, mensaje):

    try:

        correo = MIMEMultipart()

        correo["From"] = SMTP_EMAIL
        correo["To"] = destinatario
        correo["Subject"] = asunto

        correo.attach(
            MIMEText(
                mensaje,
                "html"
            )
        )

        servidor = smtplib.SMTP(
            SMTP_SERVER,
            SMTP_PORT
        )

        servidor.starttls()

        servidor.login(
            SMTP_EMAIL,
            SMTP_PASSWORD
        )

        servidor.send_message(correo)

        servidor.quit()

    except Exception:

        raise