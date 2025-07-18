// app/meals/[id]/page.js
import Image from "next/image";
import { MealFormsWrapper } from "../../../components/MealFormsWrapper/MealFormsWrapper";
import "./MealDetails.css";

export async function generateStaticParams() {
  const backendApiUrl = process.env.NEXT_PUBLIC_API_URL;
  let meals = [];

  try {
    const response = await fetch(`${backendApiUrl}/meals`, {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    meals = data.meals || data;
  } catch (error) {
    console.error("Error fetching meals for static params:", error);
    return [];
  }

  const params = meals
    .filter(
      (meal) => meal && typeof meal.id !== "undefined" && meal.id !== null
    ) // Filter out invalid meals
    .map((meal) => ({
      id: String(meal.id),
    }));
  return params;
}

async function getMealDetails(id) {
  try {
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${backendApiUrl}/meals/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      const errorMsg = `Failed to fetch meal details for ID ${id}. Status: ${response.status} ${response.statusText}`;
      console.error(errorMsg, response);
      throw new Error(errorMsg);
    }
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    return data;
  } catch (error) {
    return null;
  }
}

async function getMealReservations(mealId) {
  try {
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(
      `${backendApiUrl}/meals/${mealId}/reservations`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
}

export default async function MealDetailsPage({ params }) {
  const { id: mealId } = await params;

  const [meal, reservations] = await Promise.all([
    getMealDetails(mealId),
    getMealReservations(mealId),
  ]);

  if (!meal || Object.keys(meal).length === 0) {
    return (
      <div className="meal-details-message">
        <p>Meal not found or an error occurred.</p>
        <p>Please check the meal ID or try again later.</p>
      </div>
    );
  }

  const totalReservedGuests = reservations.reduce(
    (sum, res) => sum + res.number_of_guests,
    0
  );
  const availableReservations = meal.max_reservations - totalReservedGuests;

  return (
    <div className="meal-detail-page">
      <header className="meal-detail-header">
        <div className="meal-detail-image-container">
          <Image
            src={meal.photo_address}
            alt={meal.title || meal.name || "Meal Image"}
            fill
            className="meal-detail-image"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="meal-detail-info">
          <h1>{meal.title || meal.name}</h1>
          <p className="meal-detail-price">
            DKK {parseFloat(meal.price).toFixed(2)}
          </p>
          <p className="meal-detail-availability">
            Max Reservations: {meal.max_reservations}
          </p>
          <p className="meal-detail-availability">
            Available Seats: {availableReservations}
          </p>
          {meal.location && (
            <p className="meal-detail-location">Location: {meal.location}</p>
          )}
          {meal.when_date && (
            <p className="meal-detail-date">
              Date: {new Date(meal.when_date).toLocaleDateString()}
            </p>
          )}
        </div>
      </header>
      <main className="meal-detail-content">
        <h2>About This Meal:</h2>
        <p className="meal-detail-description">{meal.description}</p>

        {meal.ingredients && meal.ingredients.length > 0 && (
          <div className="meal-detail-ingredients">
            <h3>Ingredients:</h3>
            <ul>
              {meal.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        )}

        {meal.contactEmail && (
          <div className="meal-detail-contact">
            <h3>Contact:</h3>
            <p>
              Email:{" "}
              <a href={`mailto:${meal.contactEmail}`}>{meal.contactEmail}</a>
            </p>
          </div>
        )}

        <MealFormsWrapper
          mealId={meal.id}
          initialAvailableReservations={availableReservations}
        />
      </main>
    </div>
  );
}
