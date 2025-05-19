import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createPartyFormSchema } from "@/validations";
import {
  Form,
  FormField,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreatePartyMutation } from "@/api";
import { Loader } from "@/components/ui/loader";

const COMMON_SYMBOLS = [
  "🦁",
  "🐘",
  "🌹",
  "🌿",
  "🔆",
  "🌾",
  "💻",
  "🌍",
  "🏛️",
  "⚖️",
  "🔔",
  "🌈",
  "🌊",
  "🔥",
  "🌻",
];

const PartyForm = ({
  setGeneratedLink,
}: {
  setGeneratedLink: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const [selectedSymbol, setSelectedSymbol] = React.useState<string>("");

  const form = useForm<z.infer<typeof createPartyFormSchema>>({
    resolver: zodResolver(createPartyFormSchema),
    defaultValues: {
      party_name: "",
      party_symbol: "",
      leader_name: "",
      leader_email: "",
      link_expiry: 7,
    },
  });

  const createParty = useCreatePartyMutation();

  React.useEffect(() => {
    const randomSymbol =
      COMMON_SYMBOLS[Math.floor(Math.random() * COMMON_SYMBOLS.length)];
    setSelectedSymbol(randomSymbol);
    form.setValue("party_symbol", randomSymbol);
  }, [form]);

  const handleSymbolSelect = (symbol: string) => {
    setSelectedSymbol(symbol);
    form.setValue("party_symbol", symbol);
  };

  const onSubmit = async (data: z.infer<typeof createPartyFormSchema>) => {
    const payload = {
      party_name: data.party_name,
      party_symbol: data.party_symbol,
      user_id: "682aecdcba8823fc9633c474",
      link_expiry: data.link_expiry,
    };

    createParty.mutate(payload, {
      onSuccess: (res) => {
        console.log("Party created successfully", res);
        form.reset();
        setGeneratedLink(res.url);
      },
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="party_name"
            render={({ field }) => (
              <FormItem className="flex  flex-col">
                <FormLabel>Party Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the name of the new party"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Official name of the party</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="party_symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Party Symbol (Emoji)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Select a symbol below"
                    {...field}
                    value={selectedSymbol || field.value}
                    onChange={(e) => {
                      field.onChange(e);
                      setSelectedSymbol(e.target.value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Official symbol for the party (select below)
                </FormDescription>
                <FormMessage />
                <div className="mt-2 flex flex-wrap gap-2">
                  {COMMON_SYMBOLS.map((symbol) => (
                    <Button
                      key={symbol}
                      type="button"
                      variant={
                        selectedSymbol === symbol ? "default" : "outline"
                      }
                      size="sm"
                      className="text-xl h-10 w-10 p-0"
                      onClick={() => handleSymbolSelect(symbol)}
                      aria-label={`Select ${symbol}`}
                    >
                      {symbol}
                    </Button>
                  ))}
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="leader_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Leader Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the leader's full name"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Name of the party leader</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="leader_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Leader Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the leader's email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Email of the party leader</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="link_expiry"
          render={({ field }) => (
            <FormItem className="w-1/2">
              <FormLabel>Link Expiry (Days)</FormLabel>
              <FormControl>
                <Input type="number" min="1" max="30" {...field} />
              </FormControl>
              <FormDescription>
                Number of days before the link expires (1-30 days)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createParty.isPending} aria->
          {createParty.isPending && (
            <Loader
              size="sm"
              className="border-blue-white border-t-primary/90"
            />
          )}
          Create Party
        </Button>
      </form>
    </Form>
  );
};

export default PartyForm;
