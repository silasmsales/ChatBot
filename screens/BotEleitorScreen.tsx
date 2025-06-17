import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInputProps
} from 'react-native';

type Message = {
  type: 'user' | 'bot';
  text: string;
};

const intents = [
  {
    nome: "candidatos",
    palavras: ["candidato", "chapa", "concorrente", "quem concorre"],
    resposta: `🗳️ Os candidatos são:\n\nChapa 1 - Renovação e Diálogo\nReitor: Prof. Dr. João Silva\nVice-Reitora: Profa. Dra. Maria Santos\n\nChapa 2 - Universidade para o Futuro\nReitora: Profa. Dra. Ana Oliveira\nVice-Reitor: Prof. Dr. Carlos Pereira`
  },
  {
    nome: "regras",
    palavras: ["regra", "funciona", "como é", "norma", "regulamento", "funcionamento"],
    resposta: `📘 Regras principais:\n- Voto eletrônico e secreto\n- Uma única fase de votação\n- Registro de chapas até 30 dias antes\n- Apenas membros ativos podem votar`
  },
  {
    nome: "quem_pode_votar",
    palavras: ["quem pode votar", "quem vota", "quem tem direito", "sou aluno posso votar", "posso votar"],
    resposta: `✅ Têm direito a voto:\n- Docentes ativos\n- Técnicos-administrativos\n- Estudantes matriculados (graduação e pós)`
  },
  {
    nome: "peso_voto",
    palavras: ["peso", "vale", "voto do aluno", "voto do professor"],
    resposta: `⚖️ Peso dos votos:\n- Docentes: 70%\n- Técnicos-administrativos: 15%\n- Estudantes: 15%`
  },
  {
    nome: "data_eleicao",
    palavras: ["data", "quando", "que dia", "data da eleição", "qual a data"],
    resposta: `🗓️ A eleição será no dia 09 de outubro de 2025.`
  },
  {
    nome: "como_votar",
    palavras: ["como votar", "local de votação", "onde voto", "forma de votar", "modo de votar"],
    resposta: `📍 A votação será realizada por meio do Sistema SIGEleição, integrado ao SIGAA:\n1. Acesse o site sigeleicao.uemasul.edu.br com sua conta SIGAA ou SIPAC\n2. Escolha a eleição na lista de eleições abertas\n3. Veja as chapas e candidatos\n4. Vote na cabine virtual semelhante à urna eletrônica`
  }
];

export default function BotEleitorScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      text: '🤖 Olá! Sou a Yve. Pergunte algo sobre a eleição para Reitor(a) e Vice-Reitor(a) da UEMASUL.'
    }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  function normalize(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = { type: 'user', text: trimmed };
    const normalized = normalize(trimmed);
    let replied = false;

    for (const intent of intents) {
      for (const palavra of intent.palavras) {
        if (normalized.includes(normalize(palavra))) {
          setMessages((prev) => [...prev, userMessage, { type: 'bot', text: intent.resposta }]);
          replied = true;
          break;
        }
      }
      if (replied) break;
    }

    if (!replied) {
      setMessages((prev) => [...prev, userMessage, {
        type: 'bot',
        text: '❌ Esta pergunta não está relacionada às eleições de Reitor e Vice-Reitor. Reformule por favor.'
      }]);
    }

    setInput('');
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.chatContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>BotEleitor 🤖</Text>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.chatBody}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, idx) => (
            <View key={idx} style={[styles.message, msg.type === 'user' ? styles.user : styles.bot]}>
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Digite sua pergunta..."
            style={styles.input}
            multiline
          />
          <TouchableOpacity onPress={handleSend} style={styles.button}>
            <Text style={styles.buttonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5ddd5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    width: 380,
    maxWidth: '100%',
    height: 600,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    backgroundColor: '#075e54',
    padding: 15,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  chatBody: {
    flex: 1,
    backgroundColor: '#ece5dd',
    padding: 10,
  },
  message: {
    marginVertical: 6,
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    borderBottomRightRadius: 0,
  },
  bot: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  button: {
    backgroundColor: '#075e54',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
