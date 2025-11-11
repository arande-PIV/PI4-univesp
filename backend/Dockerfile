# Usa uma imagem base do Python
FROM python:3.10-slim

# Instala o netcat
RUN apt-get update && apt-get install -y netcat-traditional && rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho no container
WORKDIR /app

# Copia o arquivo de dependências e instala
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o código da aplicação
COPY . .

# Expõe a porta que o Flask vai usar
EXPOSE 5000

# Comando para rodar a aplicação (será sobrescrito no compose para esperar o DB)
CMD ["flask", "run", "--host=0.0.0.0"]