FROM python:3.11-slim

RUN apt-get update && apt-get install -y wget unzip && \
    wget -q https://github.com/projectdiscovery/nuclei/releases/download/v3.2.9/nuclei_3.2.9_linux_amd64.zip -O /tmp/nuclei.zip && \
    unzip /tmp/nuclei.zip -d /usr/local/bin && \
    chmod +x /usr/local/bin/nuclei && \
    rm /tmp/nuclei.zip && \
    pip install fastapi uvicorn && \
    apt-get clean

RUN nuclei -update-templates -silent

COPY api.py /api.py

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]