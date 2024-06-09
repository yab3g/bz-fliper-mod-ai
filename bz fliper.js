import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class BazaarFlippingModel {

    public static void main(String[] args) {
        String apiUrl = "https://api.hypixel.net/skyblock/bazaar";

        try {
            URL url = new URL(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String inputLine;
            StringBuilder response = new StringBuilder();

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            JSONObject jsonObject = new JSONObject(response.toString());
            JSONObject products = jsonObject.getJSONObject("products");

            List<String> profitableItems = analyzeFlips(products);
            System.out.println("Profitable Items:");
            for (String item : profitableItems) {
                System.out.println(item);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static List<String> analyzeFlips(JSONObject products) {
        List<String> profitableItems = new ArrayList<>();

        for (String item : products.keySet()) {
            JSONObject details = products.getJSONObject(item);
            JSONArray buySummary = details.getJSONArray("buy_summary");
            JSONArray sellSummary = details.getJSONArray("sell_summary");

            double buyPrice = buySummary.getJSONObject(0).getDouble("pricePerUnit");
            double sellPrice = sellSummary.getJSONObject(0).getDouble("pricePerUnit");

            // Example threshold for profit
            if (sellPrice > buyPrice * 1.1) {
                profitableItems.add(item + ": Buy Price = " + buyPrice + ", Sell Price = " + sellPrice);
            }
        }

        return profitableItems;
    }
}