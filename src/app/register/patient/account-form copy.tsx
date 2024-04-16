// const frameworks = [
//   {
//     value: "next.js",
//     label: "Next.js",
//   },
//   {
//     value: "sveltekit",
//     label: "SvelteKit",
//   },
//   {
//     value: "nuxt.js",
//     label: "Nuxt.js",
//   },
//   {
//     value: "remix",
//     label: "Remix",
//   },
//   {
//     value: "astro",
//     label: "Astro",
//   },
// ]

// const [open, setOpen] = React.useState(false)
// const [value, setValue] = React.useState("")
// const [inputValue, setInputValue] = React.useState("");
// const inputRef = React.useRef<HTMLInputElement>(null);



{/* <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div>
              <SearchIcon className="h-4 w-4" />
              <Input
                ref={inputRef}
                type="search"
                value={inputValue}
                onChange={(e) => { setInputValue(e.target.value); }}
                onClick={() => {
                  setOpen(true);
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                placeholder="Select framework..."
              >
              </Input>

              <ChevronDownIcon className="ml-auto h-4 w-4" />

            </div>


          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInputSearch
                value={inputValue}
                placeholder="Search framework..."
              />
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === framework.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {framework.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover> */}