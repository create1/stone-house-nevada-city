import { dollarsToCents } from "./money.mjs";
import { safeImageUrl } from "./html.mjs";
import { isoToZonedInput, zonedToIso } from "./time.mjs";
import { DEFAULT_REFUND_POLICY, STONE_HOUSE } from "./venue.mjs";

function field(params, name) {
  return String(params.get(name) ?? "").trim();
}

function all(params, name) {
  return params.getAll(name).map((value) => String(value ?? "").trim());
}

export function bodyToParams(body) {
  if (typeof body === "string") return new URLSearchParams(body);
  if (body instanceof URLSearchParams) return body;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(body || {})) {
    const list = Array.isArray(value) ? value : [value];
    for (const item of list) params.append(key, item == null ? "" : String(item));
  }
  return params;
}

function centsToInput(cents) {
  if (!Number.isInteger(cents)) return "";
  return (cents / 100).toFixed(2);
}

function blankTicket() {
  return {
    name: "",
    price: "",
    includesFoodAndBeverage: "no",
    includedItems: "",
    admission: "",
    foodAndBeverage: "",
    includesAlcohol: "no",
    capacity: "",
    saleStartsAt: "",
    saleEndsAt: "",
  };
}

export function eventToFormValues(event) {
  if (!event) {
    return {
      id: "",
      title: "",
      slug: "",
      startsAt: "",
      endsAt: "",
      doorsAt: "",
      description: "",
      performers: "",
      ageRule: "All ages",
      accessibilityNotes: "",
      parkingNotes: "",
      refundPolicy: DEFAULT_REFUND_POLICY,
      primaryAudience: "",
      marketingGoal: "",
      adSpendBudget: "0.00",
      adEndsAt: "",
      heroImageUrl: "",
      rightsConfirmed: false,
      ownerName: "",
      status: "draft",
      tickets: [blankTicket()],
    };
  }

  const zone = event.timeZone || STONE_HOUSE.timeZone;
  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    startsAt: isoToZonedInput(event.startsAt, zone),
    endsAt: isoToZonedInput(event.endsAt, zone),
    doorsAt: isoToZonedInput(event.doorsAt, zone),
    description: event.description || "",
    performers: event.performers || "",
    ageRule: event.ageRule || "All ages",
    accessibilityNotes: event.accessibilityNotes || "",
    parkingNotes: event.parkingNotes || "",
    refundPolicy: event.refundPolicy || DEFAULT_REFUND_POLICY,
    primaryAudience: event.primaryAudience || "",
    marketingGoal: event.marketingGoal || "",
    adSpendBudget: centsToInput(event.adSpendBudgetCents) || "0.00",
    adEndsAt: isoToZonedInput(event.adEndsAt, zone),
    heroImageUrl: event.heroImageUrl || "",
    rightsConfirmed: event.rightsConfirmed === true,
    ownerName: event.ownerName || "",
    status: event.status || "draft",
    tickets: (event.ticketTypes?.length ? event.ticketTypes : [null]).map((ticket) =>
      ticket
        ? {
            name: ticket.name || "",
            price: centsToInput(ticket.priceCents),
            includesFoodAndBeverage: ticket.includesFoodAndBeverage ? "yes" : "no",
            includedItems: ticket.includedItems || "",
            admission: centsToInput(ticket.admissionCents),
            foodAndBeverage: centsToInput(ticket.foodAndBeverageCents),
            includesAlcohol: ticket.includesAlcohol ? "yes" : "no",
            capacity: ticket.capacity ? String(ticket.capacity) : "",
            saleStartsAt: isoToZonedInput(ticket.saleStartsAt, zone),
            saleEndsAt: isoToZonedInput(ticket.saleEndsAt, zone),
          }
        : blankTicket(),
    ),
  };
}

export function parseEventForm(params) {
  const errors = [];
  const values = {
    id: field(params, "id"),
    title: field(params, "title"),
    slug: field(params, "slug"),
    startsAt: field(params, "startsAt"),
    endsAt: field(params, "endsAt"),
    doorsAt: field(params, "doorsAt"),
    description: field(params, "description"),
    performers: field(params, "performers"),
    ageRule: field(params, "ageRule") || "All ages",
    accessibilityNotes: field(params, "accessibilityNotes"),
    parkingNotes: field(params, "parkingNotes"),
    refundPolicy: field(params, "refundPolicy"),
    primaryAudience: field(params, "primaryAudience"),
    marketingGoal: field(params, "marketingGoal"),
    adSpendBudget: field(params, "adSpendBudget"),
    adEndsAt: field(params, "adEndsAt"),
    heroImageUrl: field(params, "heroImageUrl"),
    rightsConfirmed: field(params, "rightsConfirmed") === "yes",
    ownerName: field(params, "ownerName"),
    tickets: [],
  };

  const names = all(params, "ticketName");
  const count = Math.max(names.length, 1);
  for (let index = 0; index < count; index += 1) {
    values.tickets.push({
      name: names[index] || "",
      price: all(params, "ticketPrice")[index] || "",
      includesFoodAndBeverage: all(params, "ticketFood")[index] || "no",
      includedItems: all(params, "ticketIncluded")[index] || "",
      admission: all(params, "ticketAdmission")[index] || "",
      foodAndBeverage: all(params, "ticketFoodAmount")[index] || "",
      includesAlcohol: all(params, "ticketAlcohol")[index] || "no",
      capacity: all(params, "ticketCapacity")[index] || "",
      saleStartsAt: all(params, "ticketSaleStart")[index] || "",
      saleEndsAt: all(params, "ticketSaleEnd")[index] || "",
    });
  }

  const hero = values.heroImageUrl ? safeImageUrl(values.heroImageUrl) : "";
  if (values.heroImageUrl && !hero) {
    errors.push({
      field: "heroImageUrl",
      message: "Use an https image URL or a path that starts with /assets/.",
    });
  }

  const budgetCents = values.adSpendBudget ? dollarsToCents(values.adSpendBudget) : 0;
  if (values.adSpendBudget && budgetCents == null) {
    errors.push({
      field: "adSpendBudget",
      message: "Enter the ad budget in dollars, such as 200.00.",
    });
  }

  const zone = STONE_HOUSE.timeZone;
  const ticketTypes = [];
  values.tickets.forEach((ticket, index) => {
    if (!ticket.name && !ticket.price && !ticket.capacity) return;
    const priceCents = dollarsToCents(ticket.price);
    if (priceCents == null) {
      errors.push({
        field: `ticketTypes.${index}.priceCents`,
        message: "Enter a ticket price in dollars, such as 35.00.",
      });
    }
    const includesFood = ticket.includesFoodAndBeverage === "yes";
    const admissionCents = includesFood ? dollarsToCents(ticket.admission) : null;
    const foodCents = includesFood ? dollarsToCents(ticket.foodAndBeverage) : null;
    if (includesFood && admissionCents == null) {
      errors.push({
        field: `ticketTypes.${index}.admissionCents`,
        message: "Enter the admission amount in dollars.",
      });
    }
    if (includesFood && foodCents == null) {
      errors.push({
        field: `ticketTypes.${index}.foodAndBeverageCents`,
        message: "Enter the food and beverage amount in dollars.",
      });
    }
    const capacity = Number(ticket.capacity);
    ticketTypes.push({
      name: ticket.name,
      priceCents: priceCents ?? -1,
      serviceFeeCents: 0,
      includesFoodAndBeverage: includesFood,
      includedItems: ticket.includedItems,
      admissionCents: includesFood ? (admissionCents ?? -1) : undefined,
      foodAndBeverageCents: includesFood ? (foodCents ?? -1) : undefined,
      includesAlcohol: ticket.includesAlcohol === "yes",
      taxProfile: includesFood ? "split" : "admission",
      capacity: Number.isInteger(capacity) && capacity > 0 ? capacity : Number.NaN,
      saleStartsAt: ticket.saleStartsAt ? zonedToIso(ticket.saleStartsAt, zone) : "",
      saleEndsAt: ticket.saleEndsAt ? zonedToIso(ticket.saleEndsAt, zone) : "",
    });
  });

  return {
    values,
    errors,
    input: {
      id: values.id,
      title: values.title,
      slug: values.slug,
      eventType: "music",
      venueId: STONE_HOUSE.id,
      venueName: STONE_HOUSE.name,
      startsAt: values.startsAt ? zonedToIso(values.startsAt, zone) : "",
      endsAt: values.endsAt ? zonedToIso(values.endsAt, zone) : "",
      doorsAt: values.doorsAt ? zonedToIso(values.doorsAt, zone) : "",
      timeZone: zone,
      description: values.description,
      performers: values.performers,
      ageRule: values.ageRule,
      accessibilityNotes: values.accessibilityNotes,
      parkingNotes: values.parkingNotes,
      refundPolicy: values.refundPolicy,
      primaryAudience: values.primaryAudience,
      marketingGoal: values.marketingGoal,
      adSpendBudgetCents: budgetCents ?? -1,
      adEndsAt: values.adEndsAt ? zonedToIso(values.adEndsAt, zone) : "",
      heroImageUrl: hero,
      rightsConfirmed: values.rightsConfirmed,
      ownerName: values.ownerName,
      ownerUserId: values.ownerName,
      ticketTypes,
    },
  };
}
