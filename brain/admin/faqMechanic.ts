//////////////////////////////////////////////////
// Author: Jason Cruz
// Copyright © 2026
//////////////////////////////////////////////////
import { getDbCortex } from '../db/cortex';
import { BrainError, ErrorSource } from '../errors';

export async function fetchAllFaqs() {
    const supabase = await getDbCortex();
    const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) throw new BrainError("Failed to fetch FAQs", ErrorSource.DATABASE, 500, error);
    return data;
}

export async function saveFaq(faq: { id?: string, question: string, answer: string, category?: string }) {
    const supabase = await getDbCortex();

    if (faq.id) {
        // Update existing
        const { data, error } = await supabase
            .from('faqs')
            .update({ question: faq.question, answer: faq.answer, category: faq.category })
            .eq('id', faq.id)
            .select();
        if (error) throw new BrainError("Update Failed", ErrorSource.DATABASE, 500, error);
        return data;
    } else {
        // Insert new
        const { data, error } = await supabase
            .from('faqs')
            .insert([{ question: faq.question, answer: faq.answer, category: faq.category }])
            .select();
        if (error) throw new BrainError("Insert Failed", ErrorSource.DATABASE, 500, error);
        return data;
    }
}