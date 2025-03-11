import requests
from bs4 import BeautifulSoup
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

def scrape_linkedin_recommendations(url):
    """
    Scrapes LinkedIn recommendations (testimonials) from a given profile URL and
    formats them as HTML for a carousel.

    Args:
        url (str): The LinkedIn profile URL.

    Returns:
        str: A string containing the HTML for the carousel items.
    """

    options = webdriver.ChromeOptions()
    options.add_argument('--headless')  # Run Chrome in headless mode (no GUI)
    driver = webdriver.Chrome(options=options)

    driver.get(url)

    recommendations_html = ""

    try:
        # Wait for the "Show more" button to be clickable and then click it (if it exists)
        while True:
            try:
                show_more_button = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, "//button[contains(@class, 'artdeco-button--muted') and contains(text(), 'Show more')]"))
                )
                show_more_button.click()
                time.sleep(2)  # Wait for content to load
            except TimeoutException:
                break  # Exit the loop if "Show more" is not found within the timeout
    except TimeoutException:
        print("Timed out waiting for 'Show more' button. Proceeding...")
    finally:
      pass
    
    try:
        # Wait for the recommendations to load (adjust the timeout if necessary)
        WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div.recommendation-card"))
        )
    except TimeoutException:
        print("Timed out waiting for recommendations to load. Proceeding with available recommendations")

    soup = BeautifulSoup(driver.page_source, "html.parser")
    driver.quit()  # Close the browser

    recommendation_cards = soup.find_all("div", class_="recommendation-card")

    for card in recommendation_cards:
        try:
          text = card.find("p", class_="break-words").get_text(strip=True)
          name = card.find("span", class_="name").get_text(strip=True)
          position = card.find("span", class_="description").get_text(strip=True)
          
          # Generate HTML output for each testimonial
          recommendations_html += f"""
<div class="carousel-item">
  <div class="testimonial-item">
    <div class="testimonial-image">
      <img src="images/testimonial/{name}.jpg" alt="{name}" class="img-fluid rounded-circle" onerror="this.onerror=null;this.src='images/testimonial/default.png'">
    </div>
    <div class="testimonial-content">
      <p>"{text}"</p>
      <div class="testimonial-author">- {name}, {position}</div>
    </div>
  </div>
</div>
"""
        except AttributeError:
          print("Skipping incomplete recommendation")

    return recommendations_html


if __name__ == "__main__":
    linkedin_url = "https://www.linkedin.com/in/reeka-soni-14222a98/details/recommendations/?detailScreenTabIndex=0"
    carousel_html = scrape_linkedin_recommendations(linkedin_url)

    if carousel_html:
        print(carousel_html)
    else:
      print("No recommendations were found.")
