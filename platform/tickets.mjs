/**
 * Ticket prices are fee-inclusive integer cents.
 * Stone House does not add a service fee at checkout.
 *
 * Tax profiles match the spec's California split:
 * - admission: no food and beverage package
 * - split: admission and food and beverage stated separately
 */

export const TAX_PROFILES = ["admission", "split"];

function moneyError(field, message) {
  return { field, message };
}

export function validateTicketType(ticket, mode = "draft") {
  const errors = [];
  const name = String(ticket?.name ?? "").trim();
  if (!name) {
    errors.push(moneyError("name", "Ticket name is required."));
  }

  if (!Number.isInteger(ticket?.priceCents) || ticket.priceCents < 0) {
    errors.push(
      moneyError("priceCents", "Enter one fee-inclusive price in cents, with no service fee."),
    );
  }

  if (Number(ticket?.serviceFeeCents) > 0) {
    errors.push(
      moneyError(
        "serviceFeeCents",
        "Do not add a service fee. The ticket price already includes Stone House fees.",
      ),
    );
  }

  if (ticket?.includesFoodAndBeverage) {
    const included = String(ticket.includedItems ?? "").trim();
    if (!included) {
      errors.push(
        moneyError("includedItems", "List what food and beverage is included with this ticket."),
      );
    }
    const admission = ticket.admissionCents;
    const food = ticket.foodAndBeverageCents;
    if (!Number.isInteger(admission) || admission < 0) {
      errors.push(moneyError("admissionCents", "Enter the admission amount in cents."));
    }
    if (!Number.isInteger(food) || food < 0) {
      errors.push(
        moneyError("foodAndBeverageCents", "Enter the food and beverage amount in cents."),
      );
    }
    if (
      Number.isInteger(admission) &&
      Number.isInteger(food) &&
      Number.isInteger(ticket?.priceCents) &&
      admission + food !== ticket.priceCents
    ) {
      errors.push(
        moneyError(
          "priceCents",
          "Admission plus food and beverage must equal the fee-inclusive ticket price.",
        ),
      );
    }
    if (mode === "publish" && ticket.taxProfile !== "split") {
      errors.push(
        moneyError(
          "taxProfile",
          "A ticket with food and beverage uses the split tax profile before it can publish.",
        ),
      );
    }
  } else if (mode === "publish" && ticket?.taxProfile !== "admission") {
    errors.push(
      moneyError("taxProfile", "Set the admission tax profile before this ticket can publish."),
    );
  }

  if (ticket?.taxProfile && !TAX_PROFILES.includes(ticket.taxProfile)) {
    errors.push(moneyError("taxProfile", "Unknown tax profile."));
  }

  if (mode === "publish") {
    if (!Number.isInteger(ticket?.capacity) || ticket.capacity < 1) {
      errors.push(moneyError("capacity", "Capacity must be at least 1."));
    }
    if (!ticket?.saleStartsAt || !ticket?.saleEndsAt) {
      errors.push(moneyError("saleWindow", "Sale start and sale end are required."));
    } else if (new Date(ticket.saleEndsAt) <= new Date(ticket.saleStartsAt)) {
      errors.push(moneyError("saleWindow", "Sale end must be after sale start."));
    }
  }

  return { ok: errors.length === 0, errors };
}

export function requiresAlcoholAgeGate(tickets) {
  return tickets.some((ticket) => ticket.includesAlcohol === true);
}
