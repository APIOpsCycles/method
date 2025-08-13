---
title: "FAQs für erfahrene Benutzer von APIOps Cycles"
draft: false
---
Sind Sie bereits mit den Grundlagen von APIOps Cycles vertraut?

:::note
Auf dieser Seite finden Sie Antworten auf die häufigsten Fragen von Partnern und Kunden, die daran interessiert sind, die API-Bereitstellung zu skalieren, die Governance zu verbessern oder die Methode an komplexe Umgebungen anzupassen.
:::

---
## 1. Warum die Stilllegung von APIs keine Lebenszyklusphase in APIOps Cycles ist
Im Folgenden wird anhand von Produktmanagement-Prinzipien und Erfahrungen aus der Praxis erläutert, wie die Stilllegung von APIs auf natürliche Weise in bestehende Stationen passt:

**1. Station „API-Produktstrategie”**

Hier werden idealerweise Entscheidungen über die Fortführung, Umstellung oder Stilllegung einer API getroffen.
- Das Customer Journey Canvas kann zeigen, dass eine User Journey veraltet ist oder an anderer Stelle abgewickelt wird. Es ist sehr nützlich, um zukünftige Anforderungen mit Unternehmen zu überprüfen, die Journeys verwenden.
- Das API Value Proposition Canvas kann auf einen nachlassenden einzigartigen Wert hinweisen. Dieses Canvas wird häufig verwendet, um die Anforderungen von Endnutzern und Entwicklern neuen und bestehenden APIs zuzuordnen. Es sollte zeigen, ob eine API nicht mehr benötigt wird oder umfassend überarbeitet werden muss.
- Das API-Geschäftsmodell-Canvas kann einen negativen ROI oder nicht tragfähige Kostenstrukturen aufzeigen. Dieses letzte Canvas der API-Produktstrategie-Station sollte zeigen, ob Nutzen und Kosten ausgeglichen sind und ob es Verbraucher für eine API gibt.

→ Die Einstellung ist eine Produktentscheidung und nicht nur ein technisches Ereignis.

**2. Überwachungs- und Verbesserungsstation**
Hier sollten Belege für die Einstellung auftauchen und in die API-Produktstrategie einfließen.
- Nutzungsmetriken (rückläufiger Traffic, keine Aufrufe aus wichtigen Segmenten)
- Kundenfeedback (Umfrageergebnisse, NPS, GitHub-Issues)
- Betriebliche Indikatoren (Kosten-Nutzen-Verhältnis, Sicherheitslücken)

Das Fehlen von Verbesserungsmöglichkeiten kann darauf hindeuten, dass die API keine Investitionen oder ihre weitere Existenz mehr rechtfertigt.

→ Diese Station liefert die quantitativen und qualitativen Gründe für die Einstellung.

**3. Release-Management-Station**

Hier werden die Richtlinien für die Versionsablauf und die API-Abkündigung umgesetzt.
- Richtlinien zum Versionslebenszyklus
- Pläne zur Abwärtskompatibilität
- Vorlagen für die Kommunikation zum Ablauf
- Weiterleitungen und Fallback-Planung

→ Hier implementieren Sie die operativen Aspekte der Stilllegung einer API.

---

## 2. Wie kann ich APIOps Cycles in unseren Agile- oder SAFe-Prozess integrieren?
Behandeln Sie Stationen als **Workshops oder Schritte zur Verfeinerung des Backlogs** innerhalb Ihres agilen Rhythmus.
- Verwenden Sie in frühen Sprints Canvases zur Erkundung.
- Besuchen Sie Stationen wie *Audit* und *Metriken und Analysen* regelmäßig als Teil Ihres Inspektions-/Anpassungszyklus.
- In SAFe lassen sich Stationen gut mit Enabler Epics und der Governance auf Portfolioebene in Einklang bringen.
---
## 3. Wie führe ich ein API-Audit am besten durch und wie oft sollte ich es durchführen?
In der APIOps Cycles-Methode entspricht die API-Audit-Station den Punkten, die normalerweise während einer API-Designprüfung oder einem anderen bereits vorhandenen Checkpoint überprüft werden, um sicherzustellen, dass die API für die Veröffentlichung für interne oder externe Verbraucher bereit ist. Verwenden Sie dazu die [API-Audit-Checkliste](../resources/api-audit-checklist/), die je nach Status der zu überprüfenden oder zu auditierenden API in drei Phasen unterteilt ist.
 
Es gibt noch eine weitere Art von „Audit“, das *API-Fähigkeitsaudit*, mit dem Sie die API-Governance oder das API-Programm überprüfen können. Die API-Audit-Checkliste kann verwendet und automatisiert werden, um den Gesamtzustand der APIs Ihres Unternehmens zu ermitteln. Dies hängt natürlich mit der allgemeinen Denkweise, Kultur und dem Zustand Ihres gesamten API-Programms zusammen. Um jedoch tiefer in die Materie einzusteigen, sollten Sie sich näher mit dem Zustand der Vorortstationen auf der Betriebsmodelllinie und den anderen Linien befassen, wobei Sie sich jeweils auf einen Schwerpunktbereich oder eine Linie konzentrieren sollten. Unsere Partner verfügen in der Regel über umfangreiche Erfahrung darin, Sie bei der Bewertung und Erstellung von Verbesserungsplänen zur Skalierung Ihrer API-Programme zu unterstützen. 
**Häufigkeit der Fähigkeitsprüfung:** Vierteljährlich für große Programme, jährlich für kleinere Teams.
- Betrachten Sie es als eine gemeinsame Überprüfung und nicht als eine Übung zur Einhaltung von Vorschriften.
- Verknüpfen Sie die Ergebnisse mit Verbesserungsmaßnahmen in Ihrem Backlog.
---
## 4. Wie passe ich die Methode an regulierte Branchen (Finanzwesen, Gesundheitswesen usw.) an?
- Fügen Sie in den relevanten Stationen regulatorische Kontrollpunkte hinzu (z. B. API-Plattformentarchitektur-Station, die die *Business Impact*, *Location* und *Capacity Canvases* verwendet).
- Beziehen Sie Compliance-Stakeholder frühzeitig ein.
- Bewahren Sie Nachweise für Entscheidungen in Ihren Canvas-Exporten (JSON/SVG) für Audit-Trails auf. Dies ist mit dem Canvas Creator zum Ausfüllen, Exportieren und Importieren der Canvases ganz einfach, sodass Sie die von Menschen und/oder KI ausgefüllten Canvases in der Versionskontrolle speichern können.
---
## 5. Welche wesentlichen Rollen sollten bei der Skalierung der API-Bereitstellung an jeder Station beteiligt sein?
- *API-Produktstrategie mit z. B. Customer Journey/Wertversprechen*: Produktmanager, UX, Partnermanager, Architekten, leitende Entwickler
- *API-Design mit z. B. Domänen-/Interaktionsdesign*: Produktmanager, Architekten, leitende Entwickler
- *API-Plattformarchitektur mit Auswirkungen auf das Geschäft/Kapazität*: Produktmanager, Architektur, Plattformingenieure, Sicherheits- und Governance-Verantwortliche
- *Metriken und Analysen*: Daten-/Analyseteams, Plattformingenieure, Produktmanager, API-Support
---
## 6. Kann APIOps Cycles nur für interne APIs oder auch für Partner-/öffentliche APIs verwendet werden?
Beides. Alle Stationen, Linien, Ressourcen und Kriterien gelten für beide.
 
Die Unterschiede werden „innerhalb” der stationsbezogenen Arbeit deutlich, d. h. beim Ausfüllen des Customer Journey Canvas, wer der Kunde ist, und beim Ausfüllen des API Business Model Canvas, wer die API-Nutzer sind.
Tipp: Selbst bei der Planung interner APIs sind die Kunden der Customer Journey höchstwahrscheinlich die „echten Kunden” Ihres Unternehmens, d. h. externe Kunden. Die Vergangenheit hat auch gezeigt, dass die meisten internen APIs nicht für immer intern bleiben.

---

## 7. Wie messe ich die Reife eines API-Programms mit APIOps Cycles?
Verfolgen Sie
- die Abdeckung der Stationen (welche Stationen regelmäßig besucht werden)
- Qualitätsmetriken aus der Station „Metriken und Analysen“
- die Einführung von Governance anhand einzelner *API-Audit*-Ergebnisse oder anhand von Fähigkeitsaudits.
- Akzeptanz durch Verbraucher (Nutzungswachstum, Onboarding-Zeit)
---
## 8. Wie erhalte ich die Zustimmung der Führungskräfte für die unternehmensweite Verwendung dieser Methode?
- Verwenden Sie die in der Station „API-Produktstrategie” erstellten Canvases, z. B. „*Customer Journey Canvas*” und „*API Business Model Canvas*” für Führungskräfte. Messen Sie die geschäftlichen KPIs und die Akzeptanz in der Station „Überwachung und Verbesserung”.
- Verwenden Sie für technische Führungskräfte die *Business Impact*-Vorlage aus der API-Plattformarchitektur-Station und die Ergebnisse der API-Audit-Station für alle APIs, um die Ausrichtung auf die strategischen Ziele aufzuzeigen.
- Teilen Sie visuelle Darstellungen des Fortschritts und der Reife im Laufe der Zeit.
- Betonen Sie das geringere Lieferrisiko und die schnellere Markteinführung.
---
## 9. Kann ich bestimmte Stationen dauerhaft überspringen?

Sie können sie vorerst überspringen, aber nicht für immer.

Einige Stationen (z. B. „*API-Produktstrategie, API-Audit*“, „*Überwachung und Verbesserung*“) scheinen zunächst vielleicht weniger wichtig zu sein, aber wenn Sie sie auf unbestimmte Zeit überspringen, kann dies zu Governance-Lücken und technischen Schulden führen.
 
Wie unsere APIOps Cycles-Partner aus ihrer Erfahrung mit vielen Unternehmen berichten können, ist die API-Audit-Station neben der API-Produktstrategie (wenn viele neue oder verbesserte APIs geplant sind oder größere geschäftliche oder technische Änderungen anstehen) möglicherweise sogar der wichtigste Ausgangspunkt.

---
## 10. Wie hilft uns die APIOps Cycles-Methode bei der Erstellung oder Verbesserung unseres eigenen API-Governance-Modells?

APIOps Cycles ist das *Betriebssystem* für Ihre Governance. Es wandelt hochrangige Richtlinien in konkrete Artefakte, Rituale und automatisierte Prüfungen innerhalb des API-Lebenszyklus um, sodass die Governance schlank, iterativ und tatsächlich nutzbar ist.

Sie können die Teile der Methode, die direkt auf Ihr Unternehmen zutreffen, verwenden und verlinken und zusätzliche Anforderungen oder Dokumente in Ihre eigene interne Dokumentation aufnehmen. Die **APIOps Cycles-Ressourcen** umfassen Vorlagen, Richtlinien und Beispiel-Tooltypen, die Sie an Ihr Governance-Modell anpassen können. Abgesehen von den Vorlagen, der **API-Audit-Checkliste** und den **API-Designprinzipien** handelt es sich bei den meisten Ressourcen um „Stubs“, die anzeigen, was bereitgestellt werden könnte oder sollte – und nicht um vollständige, verbindliche Richtlinien.

**Sie haben folgende Möglichkeiten:**
- **Unverändert verwenden**: Verlinken Sie relevante Methodenteile direkt in Ihren Governance-Dokumenten.
- **Anpassen**: Passen Sie Vorlagen, Checklisten oder Richtlinien an Ihre internen Standards an.
- **Beitragen**: Schlagen Sie neue Richtlinien oder Ressourcen vor, die in die APIOps Cycles-Methode aufgenommen werden sollen, damit andere davon profitieren können.

Das Ergebnis ist ein Governance-Modell, das **Ihre internen Richtlinien** mit **in der Community bewährten APIOps Cycles-Praktiken** verbindet und es Teams erleichtert, diese zu befolgen, und Führungskräften, sie im Tagesgeschäft durchzusetzen.