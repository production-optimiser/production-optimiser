import pandas as pd
import random
import math


def init_list(product_amount):
    initial_list = []
    # Here we create a list based on products and its amount in product_amount (which is in excel)
    for i, x in product_amount.items():
        initial_list.extend([i] * x)
    input_list = initial_list
    return input_list  # Returns the list of products, in alphabetical order


def init_population(product_amount, population_size):  # Creates a population based on population_size and init_list
    pop_list = []
    for _ in range(population_size):
        pop_list.append(init_list(product_amount))
    return pop_list


def fitness(products, max_products_per_group, process_steps, processing_times, product_paths, setup_times_dict):
    time_list = []
    # Loop through the entire population of sequences
    # If you want to change things be sure to "reset" lists to be reused for each sequence
    for sequence in products:
        time_taken = []  # list of individual and time for the sequence, saved as a tuple[[x],y]
        best_time = []  # list of best time for given sequence (added to time_taken)
        products_in_process = []  # list of products in motion
        step_availability = {step: [0] * process_steps[step] for step in process_steps}  # Initially sets all steps to 0, i.e. that no processing step is occupied
        time_taken.append(sequence)
        previous_product = None

        # Loop through all products in the sequences
        for product in sequence:
            s_time = 0 #Setting time, starts at 0
            total_time = 0 # Total time, also starts at 0
            steps = [step for step in product_paths[product] if not pd.isnull(step) and "buffer" not in step]  # Add steps to "steps" based on which processing steps each product has, if it is NaN or Buffer then it should not be added to the list of steps
            group_key = next(key for key in max_products_per_group if product in key)  # Checks which group the product belongs to and then checks how many products can be processed simultaneously for that specific product group
            max_concurrent_products = max_products_per_group[group_key] # maximum number of products, taken from pallet quantity

            # The while loop checks if it is full in the production line, if it is full, it loops until there is a free place in the production line
            while sum(1 for p in products_in_process if p[0] in group_key) >= max_concurrent_products:
                earliest_finish = min((p for p in products_in_process if p[0][0] in group_key), key=lambda x: x[1])  # earliest finish checks which product is the product that will finish first.
                total_time = earliest_finish[1] # Sets total time to the product that is ready first
                products_in_process.remove(earliest_finish) # takes said product off the line

            # This for loop iterates through all process steps that a product has to check when a process becomes available
            for step in steps:
                process_time = processing_times[step].get(product, 0)

                # We only add setup time if the product has a processing time of more than 0 (i.e. that it must be processed)
                if previous_product is not None and process_time > 0:
                    setup_time_key = (previous_product + product).lower()
                    s_time = setup_times_dict.get(step.lower(), {}).get(setup_time_key, 0)

                earliest_available = min(step_availability[step]) #Takes the one with the shortest time (the one that finishes first) and first checks if it is free, otherwise adds "waiting time" to the current time
                total_time = max(total_time, earliest_available)
                process_time = processing_times[step].get(product, 0) # picks process time from excel
                total_time += process_time #adds process time
                total_time += s_time # adds set time
                index_to_update = step_availability[step].index(earliest_available) # Checks which location is ready
                step_availability[step][index_to_update] = total_time #Adds time run at the step

            best_time.append(total_time)
            products_in_process.append((product, total_time))
            previous_product = str(product) #set the latest product as previous_product, so we keep track of the set-up time

        time_taken.append(max(best_time))
        time_list.append(time_taken)
    return time_list


def fitness_no_setup_time(products, max_products_per_group, process_steps, processing_times, product_paths):

    # Same as above, but without setting time, read it instead
    time_list = []
    # Loop through the entire population of sequences
    # If you want to change things be sure to "reset" lists to be reused for each sequence
    for sequence in products:
        time_taken = []
        best_time = []
        products_in_process = []
        step_availability = {step: [0] * process_steps[step] for step in process_steps}  # Initially sets all steps to 0, i.e. that no processing step is occupied
        time_taken.append(sequence)

        # Loop through all products in the sequences
        for product in sequence:
            total_time = 0
            steps = [step for step in product_paths[product] if not pd.isnull(step) and "buffer" not in step]  # Add steps to "steps" based on which processing steps each product has, if it is NaN or Buffer then it should not be added to the list of steps
            group_key = next(key for key in max_products_per_group if product in key)  # Checks which group the product belongs to and then checks how many products can be processed simultaneously for that specific product group
            max_concurrent_products = max_products_per_group[group_key]

            # The while loop checks if it is full in the production line, if it is full, it loops until there is a free place in the production line
            while sum(1 for p in products_in_process if p[0] in group_key) >= max_concurrent_products:
                earliest_finish = min((p for p in products_in_process if p[0][0] in group_key), key=lambda x: x[1])  # earliest finish checks which product is the product that will finish first.
                total_time = earliest_finish[1]
                products_in_process.remove(earliest_finish)

            # This for loop iterates through all process steps that a product has to check when a process becomes available
            for step in steps:
                earliest_available = min(step_availability[step])
                total_time = max(total_time, earliest_available)
                process_time = processing_times[step].get(product, 0)
                total_time += process_time
                index_to_update = step_availability[step].index(earliest_available)
                step_availability[step][index_to_update] = total_time

            best_time.append(total_time)
            products_in_process.append((product, total_time))

        time_taken.append(max(best_time))
        time_list.append(time_taken)
    return time_list


# A common tournament selection function is defined here that the genetic algorithm uses
def tournament_selection(fitness_population):
    ranking = random.sample(range(len(fitness_population)), 3)  # 3 individuals are randomly selected from the population
    best_value = [[], math.inf]  # Here we set the best fitness value to a very large number (infinity)
    for i in ranking:
        if fitness_population[i][1] < best_value[1]:  # Here we check if the fitness value of that individual is lower than the best fitness value so far, if it is better then that individual becomes "the best"
            best_value = fitness_population[i]
    return (best_value[0])


# A simple crossover function is defined here
def crossover(parent1, parent2, offspring_size):
    offspring = []
    for _ in range(offspring_size):
        crossover_point = random.randint(0, len(parent1[0]))  # Here a random index is chosen which will be our splitting point.
        child = parent1[:crossover_point] + parent2[crossover_point:]  # We then add one half from parent1 and the other half from parent2
        offspring.append(child)  # Finally, we add the new child to the offspring list
    return offspring


# Here we define our adaptive mutation
def adaptive_mutation(offspring, mutation_rate, generation, max_generation):
    current_mutation_rate = mutation_rate * (1 - generation / max_generation)  # This calculation means that for each generation that passes, the chance of mutation increases
    for i in range(len(offspring)):
        if random.random() < current_mutation_rate:  # If the random number is less than current_mutation_rate then the individual will be mutated
            indexes = random.sample(range(len(offspring[i])), min(1, len(offspring[i])))  # Here you randomly select the index to be mutated
            random.shuffle(indexes)  # indexes are then shuffled
            for idx in indexes:
                new_idx = random.randint(0, len(offspring[i]) - 1)  # Then a range of indexes to be mutated is randomized
                offspring[i].insert(new_idx, offspring[i].pop(idx))  # Then these indexes are replaced in the offspring
    return offspring


# Here we define the function that keeps track of whether the quantity of products matches what is written in the Excel file
def enforce_quantity_constraint(individual, check_amount):
    individual_counts = {product: individual.count(product) for product in set(individual)}  # Here we check that the amount of products in an individual matches the amount specified in excel. If this is true, True is returned, otherwise False, and then a new offspring is generated which is checked again.
    for product, quantity in check_amount.items():
        if individual_counts.get(product, 0) != quantity:
            return False
    return True
