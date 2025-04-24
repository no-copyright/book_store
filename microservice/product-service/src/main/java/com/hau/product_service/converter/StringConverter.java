package com.hau.product_service.converter;

public class StringConverter {
    public static String toSlug(String str) {
        // Convert to lowercase
        str = str.toLowerCase();

        // Replace spaces with hyphens
        str = str.replaceAll(" ", "-");

        // Remove special characters
        str = str.replaceAll("[^a-z0-9-]", "");

        // Remove consecutive hyphens
        str = str.replaceAll("-+", "-");

        // Trim leading and trailing hyphens
        str = str.replaceAll("^-|-$", "");

        return str;
    }
}
