---
title: "FAQs for Experienced APIOps Cycles Users"
draft: false
---

Already familiar with the [APIOps Cycles basics](../getting-started/)?

:::note
This page answers the most common questions we get from partners and customers interested in scaling API delivery, improving governance, or tailoring the method for complex environments.
:::

---

## 1. Why retiring APIs is not a lifecycle stage in APIOps Cycles

Here's a breakdown of how API retirement naturally fits into existing stations, based on product management principles, and experience from the "trenches":

**1. API Product Strategy Station**

This is where decisions about continuing, pivoting, or retiring an API ideally belong.

- The Customer Journey Canvas may show that a user journey is obsolete or handled elsewhere. It's very useful for checking future requirements with businesses using journeys.
- The API Value Proposition Canvas can signal diminishing unique value. This canvas is often used to map end-user and developer needs to new and existing APIs. It should show if an API is no longer needed or requires extensive redoing.
- The API Business Model Canvas may reveal negative ROI or unsustainable cost structures. This final canvas of the API Product Strategy station should show whether the benefits and costs are balanced, and whether any consumers are available for an API.

→ Retirement is a product decision, not just a technical event.

**2. Monitoring & Improving Station**

This is where evidence for retirement should emerge, and feed the API Product Strategy.

- Usage metrics (declining traffic, no calls from key segments)
- Consumer feedback (survey scores, NPS, GitHub issues)
- Operational indicators (cost vs. benefit ratios, security vulnerabilities)

The lack of improvement opportunities may indicate that the API no longer justifies investment or continued existence.

→ This station provides the quantitative and qualitative rationale for retirement.

**3. Release Management Station**

This is where the execution of version sunsetting and API deprecation guidelines already exists.

- Version lifecycle policies
- Backward compatibility plans
- Sunset communication templates
- Redirects and fallback planning

→ This is where you implement the operational aspects of retiring an API.

---

## 2. How can I integrate APIOps Cycles with our Agile or SAFe process?

Treat stations as **workshops or backlog refinement steps** within your Agile cadence.

- Use canvases in early sprints for discovery.
- Revisit stations like *Audit* and *Metrics & Analytics* regularly as part of your inspect/adapt cycle.
- In SAFe, stations align well with Enabler Epics and Portfolio-level governance.

---

## 3. What’s the best way to run an API Audit, and how often should I do it?

In APIOps Cycles method, the API Audit station corresponds with things typically checked during an API Desig Review or any checkpoint that you may already have for making sure the API is ready for publishing for internal or external consumers. Use the [API Audit Checklist](../resources/api-audit-checklist/) for that, it’s devided in three phases depending on the state of the API being reviewed or audited. 

There is another kind of “audit”, an *API capability audit*, of the API governance or API program that you can do also. The API Audit checklist may be used and automated to determine the overall health of your organization’s APIs. That does correlate on the general mindset, culture and state of your whole API program. But to get deeper, you may want look more into the state of the suburb stations on the Operating Model Line,  and the other lines, one focus area or line at the time. Our partners are typically experienced in helping you in assessing and making improvement plans to scale your API programs up. 

**Capability audit frequency:** Quarterly for large programs, annually for smaller teams.

- Treat it as a collaborative review, not a compliance exercise.
- Link findings to improvement items in your backlog.

---

## 4. How do I adapt the method for regulated industries (finance, healthcare, etc.)?

- Add regulatory checkpoints in relevant stations (e.g. API Platform Architecture station that use the *Business Impact*, *Location*, and *Capacity Canvases*).
- Include compliance stakeholders early.
- Keep evidence of decisions in your canvas exports (JSON/SVG) for audit trails. This is easy to do using the Canvas Creator to fill, export and import the canvases, so you can store the human and/or AI filled canvases in version control.

---

## 5. What are the essential roles that should be involved at each station when scaling API delivery?

- *API Product Strategy station involving e.g. Customer Journey / Value Proposition*: Product Managers, UX, Partner Managers, Architects, Lead Developers
- *API Design station with e.g. Domain / Interaction Design*: Product Managers, Architects, Lead Developers
- *API Platform Architecture involving Business Impact / Capacity*: Product Managers, Architecture, Platform Engineers, Security, Governance Leads
- *Metrics & Analytics*: Data/Analytics teams, Platform Engineers, Product Managers, API Support

---

## 6. Can APIOps Cycles be used for internal APIs only, or also for partner/public APIs?

Both. All stations, lines, resources and criteria apply to both. 

The differences will be apparent “inside” the station related work i.e. when filling in Customer Journey canvas, who is the customer, and when filling in API Business Model Canvas, who are the API consumers. 

:::tip
Even when planning internal APIs, the customers of the Customer Journey are most likely your organization’s “real customers” i.e. external. History also proves that most internal APIs don’t staty internal for ever.
:::

---

## 7. How do I measure API program maturity using APIOps Cycles?

Track:

- Station coverage (which stations are visited regularly)
- Quality metrics from *Metrics & Analytics* station
- Governance adoption from  individual *API Audit* results or from capability audits.
- Consumer adoption (usage growth, onboarding time)

---

## 8. How do I get executive buy-in for using this method across the organization?

- Use the canvases created at the API Product Strategy station, such as *Customer Journey Canvas,* and *API Business Model Canvas* for business executives. Measure business KPIs and adoption at the Monitoring & Improving station.
- For tech leaders, use the *Business Impact* canvas from API Platform Architecture station, and API Audit station results across APIs to show alignment with strategic goals.
- Share metro map visuals of progress and maturity over time.
- Emphasize reduced delivery risk and faster time-to-market.

---

## 9. Can I skip certain stations permanently?

You can skip for now, but not forever.

Some stations (e.g., *API Product Strategy, API Audit*, *Monitoring and Improving)* may feel low-priority initially, but skipping them indefinitely can create governance gaps and technical debt. 

As our APIOps Cycles partners’ can tell you from experience with many organizations, the API Audit station may be even the most important to start with, in addition to API Product Strategy (if there are lots of new or improved APIs planned, or major business or technical changes). 

---

## 10. How does the APIOps Cycles method help us create or improve our own API governance model?

APIOps Cycles is the *operating system* for your governance. It turns high-level policies into concrete artifacts, rituals, and automated checks inside the API lifecycle—so governance is lightweight, iterative, and actually used.

You can use and link to the parts of the method that directly apply to your organization, and add any additional requirements or documents into your own internal documentation. The **APIOps Cycles resources** include canvases, guidelines, and example tool types you can adapt for your governance model. Apart from the canvases, the **API Audit Checklist**, and the **API Design Principles**, most resources are “stubs” that indicate what could or should be provided—rather than complete, prescriptive guidelines.

**Your options include:**

- **Use as-is**: Link to relevant method parts directly in your governance docs.
- **Adapt**: Customize canvases, checklists, or guidelines for your internal standards.
- **Contribute**: Suggest new guidelines or resources for inclusion in the APIOps Cycles method, so others can benefit.

You end up with a governance model that blends **your internal policies** with **community-tested APIOps Cycles practices**, making it easier for teams to follow and for leaders to enforce through day-to-day delivery.